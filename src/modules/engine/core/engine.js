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

  static transientProps = ['transient'];

  /** This will convert given object to a plain json object*/
  static marshall(object) {
    if (typeof object === 'object') {
      let transients = this.transientProps;
      if (Array.isArray(object['transient'])) {
        transients = transients.concat(object['transient']);
      }
      for (const key in object) {
        if (transients.indexOf(key) < 0) {
          if (typeof object[key].marshall === 'function') {
            object[key] = object[key].marshall();
          } else {
            object[key] = this.marshall(object[key]);
          }
        }
      }
      return object;
    } else if (Array.isArray(object)) {
      return object.map(entry => this.marshall(entry));
    } else if (object instanceof Date) {
      return object.getTime();
    }
    return object;
  }

  /** This will populate given pojo to given instance*/
  static unmarshall(instance, object) {
    if (typeof object === 'string') {
      object = JSON.parse(object);
    }
    if (typeof object === 'object') {
      for (const key in object) {
        if (typeof instance[key].unmarshall === 'function') {
          instance[key] = instance[key].unmarshall(object[key]);
        } else {
          instance[key] = this.unmarshall(instance[key], object[key]);
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
    return object;
  }
}
