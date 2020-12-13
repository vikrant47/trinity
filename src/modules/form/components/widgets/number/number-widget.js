import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

export default class NumberWidget extends BaseWidget {
  getWidgetSettings() {
    return {
      defaultValue: 0
    };
  }

  getPalletSettings() {
    return {
      label: 'number',
      icon: 'number'
    };
  }

  componentRender(component, h) {
    return h('el-input-number', this.getComponentConfig(component), this.getChildren());
  }
}
