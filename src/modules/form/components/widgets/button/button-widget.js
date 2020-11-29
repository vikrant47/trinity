import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

export default class ButtonWidget extends BaseWidget {
  getFieldSettings() {
    return { type: 'primary' };
  }

  getPalletSettings() {
    return {
      label: 'Button',
      icon: 'button'
    };
  }

  getChildren(h) {
    return 'Button';
  }

  componentRender(component, h) {
    return h('el-button', this.prepareComponentConfig(), this.getChildren());
  }
}
