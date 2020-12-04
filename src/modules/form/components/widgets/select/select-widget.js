import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

export default class SelectWidget extends BaseWidget {
  getPalletSettings() {
    return {
      label: 'Select',
      icon: 'select'
    };
  }

  constructor(settings = {}) {
    settings = Object.assign({
      multiple: false,
      collapseTags: false,
      clearable: true,
      filterable: true,
      allowCreate: false,
      defaultFirstOption: false
    }, settings);
    super(settings);
  }

  options(h, key) {
    const list = [];
    this.slot.options.forEach(item => {
      list.push(<el-option label={item.label} value={item.value} disabled={item.disabled}/>);
    });
    return list;
  }

  getComponentConfig() {
    const config = super.getComponentConfig();
    config.attrs.value = this.getValue();
    return config;
  }

  componentRender(component, h) {
    return h('el-select', this.getComponentConfig(), this.getChildren(h));
  }
}
