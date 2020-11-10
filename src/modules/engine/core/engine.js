import CRUD from '@crud/crud';

export class Engine {
  static NOTIFICATION_TYPE = {
    SUCCESS: 'success',
    WARNING: 'warning',
    INFO: 'info',
    ERROR: 'error'
  };
  static DEFAULT_NOTIFICATION = {
    type: this.NOTIFICATION_TYPE.SUCCESS,
    duration: 2500
  };

  static notify(vm, options) {
    vm.$notify(Object.assign({}, Engine.DEFAULT_NOTIFICATION, options));
  }
}
