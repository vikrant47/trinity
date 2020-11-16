import * as _ from 'lodash';
import da from 'element-ui/src/locale/lang/da';

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
}
