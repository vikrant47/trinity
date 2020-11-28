import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

export default class colorPickerWidget extends BaseWidget {
  getPalletSettings() {
    return {
      label: 'Color Picker',
      icon: 'color-picker'
    };
  }

  componentRender(component, h) {
    return h('el-color-picker', this.prepareComponentConfig(), this.getChildren());
  }
}
