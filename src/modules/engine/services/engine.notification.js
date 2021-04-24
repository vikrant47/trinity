import { MessageBox } from 'element-ui';
import { Message } from 'element-ui';

export class EngineNotification {
  static defaultMessageConfig = {
    showClose: true,
    type: 'success',
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
  };
  /** @type instance NavigationService*/
  static instance = new EngineNotification();

  /** @return EngineNotification*/
  static getInstance() {
    return EngineNotification.instance;
  }

  async showMessage(settings = {}) {
    settings = Object.assign({}, EngineNotification.defaultMessageConfig, settings);
    await Message(settings);
  }

  async showMessageBox(settings = {}) {
    settings = Object.assign({}, EngineNotification.defaultMessageConfig, settings);
    await MessageBox(settings);
  }

  async showAlert(message, title, settings = {}) {
    settings = Object.assign({}, EngineNotification.defaultMessageConfig, settings);
    return MessageBox.alert(message, title, settings);
  }

  async showConfirm(message, title, settings = {}) {
    settings = Object.assign({}, EngineNotification.defaultMessageConfig, settings);
    return MessageBox.confirm(message, title, settings);
  }

  async showPrompt(message, title, settings = {}) {
    settings = Object.assign({}, EngineNotification.defaultMessageConfig, settings);
    return MessageBox.prompt(message, title, settings);
  }
}
