import { EngineObservable } from '@/modules/engine/core/engine.observable';
import { EngineAction } from '@/modules/engine/core/engine.action';

export class EnginePopup extends EngineObservable {
  static popups = []; // all the popups in the world
  static sizes = {
    mini: '30%',
    small: '50%',
    medium: '70%',
    large: '90%',
    huge: '100%'
  };
  static events = {
    show: 'show',
    hide: 'hide'
  };
  id = null;
  _index = -1;
  component = { type: null, props: null, instance: null };
  visible = true;
  actions = [];
  width = '60%';
  size = 'medium';
  showCancel = true;

  static destroy(popId) {
    const index = EnginePopup.findIndex(popId);
    EnginePopup.popups.splice(index, 1);
  }

  static findIndex(popId) {
    return EnginePopup.popups.findIndex(popup => popup.id === popId);
  }

  static open(settings = {}) {
    if (settings.id) {
      const popup = EnginePopup.get(settings.id);
      if (popup) {
        popup.show();
        return popup;
      }
    }
    const popup = new EnginePopup(settings);
    EnginePopup.popups.push(popup);
    return popup;
  }

  static get(popId) {
    return EnginePopup.popups.find(popup => popup.id === popId);
  }

  constructor(settings = {}) {
    if (settings.id) {
      const popup = EnginePopup.get(settings.id); // destroyying an existing component withs ame id
      if (popup) {
        throw new Error('A popup exists with same id' + settings.id);
      }
    }
    super();
    Object.assign(this, settings);
    this.width = EnginePopup.sizes[this.size];
    if (!this.id) {
      this.id = new Date().getTime();
    }
    if (this.showCancel) {
      this.actions.push(new EngineAction({
        label: 'Cancel',
        icon: 'el-icon-close',
        compiled: true,
        script: () => {
          this.destroy();
        },
        sort_order: 10000
      }));
    }
    this.sortActions();
    this.initComponent();
  }

  static getComponentLoader() {
    return require('./engine.component.loader').EngineComponentLoader;
  }

  initComponent() {
    if (typeof this.component.type === 'string') {
      const loader = EnginePopup.getComponentLoader();
      this.component.type = loader.getComponent(this.component.type);
    }
  }

  sortActions() {
    this.actions = this.actions.sort((a1, a2) => a1.sort_order - a2.sort_order);
  }

  show() {
    if (!this.visible) {
      this.visible = true;
      this.emit(EnginePopup.events.show);
    }
  }

  hide() {
    if (this.visible) {
      this.visible = false;
      this.emit(EnginePopup.events.hide);
    }
  }

  destroy() {
    this.onClosed();
    EnginePopup.destroy(this.id);
  }

  /** events*/
  mounted() {
    this.component.instance = this.$refs.componentInstance;
    this.emit('open');
    if (this.visible === true) {
      this.emit('show');
    }
  }

  onClosed() {
    this.emit('closed');
  }
}
