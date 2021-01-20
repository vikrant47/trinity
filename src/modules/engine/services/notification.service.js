import { Message } from 'element-ui';
export class NotificationService {
  static defaultMessageConfig = {
    showClose: true,
    message: 'Done.',
    type: 'success'
  };
  /** @type instance NavigationService*/
  static instance = new NotificationService();

  /** @return NavigationService*/
  static getInstance() {
    return NotificationService.instance;
  }

  showMessage(settings = {}) {
    settings = Object.assign({}, NotificationService.defaultMessageConfig, settings);
    Message(settings);
  }
}