import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

export default class RadioGroupWidget extends BaseWidget {
  getPalletSettings() {
    return {
      label: 'Radio',
      icon: 'radio'
    };
  }

  options(h, key) {
    const list = [];
    this.fieldSettings.slot.options.forEach(item => {
      if (this.fieldSettings.component.optionType === 'button') {
        list.push(<el-radio-button label={item.value}>{item.label}</el-radio-button>);
      } else {
        list.push(<el-radio label={item.value} border={this.fieldSettings.border}>{item.label}</el-radio>);
      }
    });
    return list;
  }

  componentRender(component, h) {
    return h('el-radio-group', this.prepareComponentConfig(), this.getChildren(h));
  }
}
