import * as _ from 'lodash';

export class Engine {
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

  static transientProps = ['transient', '__ob__', 'undefined'];

  /** This will convert given object to a plain json object*/
  static marshall(instance) {
    if (typeof instance !== 'undefined' && instance !== null) {
      if (typeof instance.marshall === 'function') {
        return instance.marshall();
      }
      if (typeof instance === 'object') {
        let transients = this.transientProps;
        if (Array.isArray(instance['transient'])) {
          transients = transients.concat(instance['transient']);
        }
        for (const key in instance) {
          if (instance.hasOwnProperty(key) && typeof instance[key] !== 'function' && transients.indexOf(key) < 0) {
            if (instance[key] && typeof instance[key].marshall === 'function') {
              instance[key] = instance[key].marshall();
            } else {
              instance[key] = this.marshall(instance[key]);
            }
          }
        }
        return instance;
      } else if (Array.isArray(instance)) {
        return instance.map(entry => this.marshall(entry));
      } else if (instance instanceof Date) {
        return instance.getTime();
      }
    }
    return instance;
  }

  /** This will populate given pojo to given instance*/
  static unmarshall(instance, object) {
    if (typeof object === 'string') {
      object = JSON.parse(object);
    }
    if (typeof instance.unmarshall === 'function') {
      instance.unmarshall(object);
      return instance;
    }
    if (typeof object === 'object') {
      for (const key in object) {
        if (typeof instance[key] !== 'undefined') {
          if (instance[key] !== null && typeof instance[key].unmarshall === 'function') {
            instance[key] = instance[key].unmarshall(object[key]);
          } else {
            instance[key] = object[key];
          }
        }
      }
      return instance;
    } else if (Array.isArray(object)) {
      for (let i = 0; i < object.length; i++) {
        instance[i] = this.unmarshall(instance[i], object[i]);
      }
    } else if (object instanceof Date) {
      return object.getTime();
    }
    return instance;
  }

  static serialize(object) {
    return JSON.stringify(this.marshall(object));
  }

  static unserialize(instance, serialized) {
    return this.unmarshall(instance, JSON.parse(serialized));
  }

  /** Clone given object by stringify and parsing it back*/
  static clone(object) {
    return JSON.parse(JSON.stringify(object));
  }
}
