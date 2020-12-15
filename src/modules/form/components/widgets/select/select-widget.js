import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

export default class SelectWidget extends BaseWidget {
  palletSettings = {
    label: 'Select',
    icon: 'select'
  };
  fieldSettings = {
    multiple: false,
    collapseTags: false,
    clearable: true,
    filterable: true,
    allowCreate: false,
    defaultFirstOption: false
  };

  options(h, key) {
    const list = [];
    this.slot.options.forEach(item => {
      list.push(<el-option label={item.label} value={item.value} disabled={item.disabled}/>);
    });
    return list;
  }

  componentRender(component, h) {
    return h('el-select', this.getComponentConfig(component), this.getChildren(h));
  }
}
