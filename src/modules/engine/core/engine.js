import * as _ from 'lodash';

export class Engine {
  static TRANSIENTS = ['transient', '__ob__', 'undefined'];
  static NOTIFICATION_TYPE = {
    SUCCESS: 'success',
    WARNING: 'warning',
    INFO: 'info',
    ERROR: 'error'
  };
  static DEFAULT_SETTINGS = {
    notification: {
      type: this.NOTIFICATION_TYPE.SUCCESS,
      duration: 2500
    },
    dataToTree: {
      idField: 'id',
      parentField: 'parentId',
      comparator: null
    }
  };

  static notify(vm, options) {
    vm.$notify(Object.assign({}, Engine.DEFAULT_SETTINGS.notification, options));
  }

  /**
   * This will convert given data to tree which parent child relationship
   * e.g. [{id:1,name:parent,parent_id:null},{name:child,parent_id:1}]  will be converted into
   * [{id:1,name:parent,parent_id:null,children:[{name:child,parent_id:1}]}]
   */
  static convertToTree(data = [], options = {}) {
    const settings = Object.assign({}, this.DEFAULT_SETTINGS.dataToTree, options);
    if (typeof settings.comparator === 'function') {
      data = data.sort(settings.comparator);
    }
    const dataById = _.keyBy(data, settings.idField);
    for (const record of data) {
      const parentId = record[settings.parentField];
      if (parentId) {
        const parent = dataById[parentId];
        if (typeof parent.children === 'undefined') {
          parent.children = [];
        }
        parent.children.push(record);
        record.child = true;
      }
    }
    return data.filter(record => !record.child);
  }

  /** This will convert given object to a plain json object*/
  static marshall(object) {
    // null, undefined, non-object, function
    if (!object || typeof object !== 'object') {
      return object;
    }
    // DOM Node
    if (object.nodeType && 'cloneNode' in object) {
      return object.cloneNode(true);
    }
    if (object) {
      if (typeof object.marshall === 'function') {
        const marshalled = object.marshall(); // must return an object otherwise return false if cant handled
        if (marshalled !== false) {
          return marshalled;
        }
      }
      if (Array.isArray(object)) {
        return object.map(entry => this.marshall(entry));
      } else if (typeof object === 'object') {
        const marshalled = {};
        let transients = this.TRANSIENTS;
        if (Array.isArray(object['transient'])) {
          transients = transients.concat(object['transient']);
        }
        for (const key in object) {
          if (transients.indexOf(key) < 0) {
            marshalled[key] = this.marshall(object[key]);
          }
        }
        return marshalled;
      } else if (object instanceof Date) {
        return new Date(object.getTime());
      }
    }
    return object;
  }

  /** This will populate given pojo to given instance*/
  static unmarshall(object, instance = {}) {
    // null, undefined, non-object, function
    if (!object || typeof object !== 'object') {
      return object;
    }
    // DOM Node
    if (object.nodeType && 'cloneNode' in object) {
      return object.cloneNode(true);
    }
    if (instance) {
      if (typeof instance.unmarshall === 'function') {
        const unmarshalled = instance.unmarshall(object);
        if (unmarshalled !== false) { // will be returned true if all handled by instance
          return instance;
        }
      }
      if (Array.isArray(object)) {
        const unmarshalled = [];
        for (let i = 0; i < object.length; i++) {
          unmarshalled[i] = this.unmarshall(object[i], instance[i]);
        }
        return unmarshalled;
      } else if (typeof object === 'object') {
        let transients = this.TRANSIENTS;
        if (Array.isArray(instance['transient'])) {
          transients = transients.concat(instance['transient']);
        }
        for (const key in object) {
          if (typeof object[key] !== 'undefined' && transients.indexOf(key) < 0) {
            instance[key] = Engine.unmarshall(object[key], instance[key]);
          }
        }
        return instance;
      }
      return object;
    }
    return JSON.parse(JSON.stringify(object));
  }

  static serialize(object) {
    return JSON.stringify(this.marshall(object));
  }

  static unserialize(instance, serialized) {
    return this.unmarshall(instance, JSON.parse(serialized));
  }

  /** Clone given object by stringify and parsing it back*/
  static clone(object, useMarshalling = false, target = {}) {
    if (useMarshalling === true) {
      const cloned = Object.assign(target, this.marshall(object));
      // console.log('cloned ', object, ' as ', cloned);
      return cloned;
    }
    return JSON.parse(JSON.stringify(object));
  }
}
