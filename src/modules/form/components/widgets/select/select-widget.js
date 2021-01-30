import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import { WIDGETS } from '@/modules/form/components/widgets/base-widget/widgets';
import { ITEM_LAYOUT } from '@/modules/form/components/widgets/base-widget/widget-config';

export default class SelectWidget extends BaseWidget {
  palletSettings = {
    label: 'Select',
    icon: 'select'
  };
  overrideConfigSection(configSectionWidgets) {
    return Object.assign(configSectionWidgets, {
      'widgetSettings.slot.options': {
        fieldName: 'widgetSettings.slot.options',
        widgetAlias: WIDGETS.repeater,
        fieldSettings: {
          required: true,
        },
        widgetSettings: {
          span: 24,
          label: 'Layout',
          widgetIcon: 'select',
          defaultValue: ITEM_LAYOUT.colFormItem,
          repeaterConfig: {},
        }
      }
    });
  }

  overrideFieldSettings(fieldSettings) {
    return Object.assign({
      multiple: false,
      collapseTags: false,
      clearable: true,
      filterable: true,
      allowCreate: false,
      defaultFirstOption: false
    }, fieldSettings);
  }
  slot = {
    options: []
  }
  options(h, key) {
    const list = [];
    if (this.slot.options) {
      if (typeof this.slot.options === 'string') {
        this.slot.options = JSON.parse(this.slot.options);
      }
      this.slot.options.forEach(item => {
        list.push(<el-option label={item.label} value={item.value} disabled={item.disabled}/>);
      });
    }
    return list;
  }

  componentRender(component, h) {
    return h('el-select', this.getComponentConfig(component), this.getChildren(h));
  }
}
