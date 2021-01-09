import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import { RestQuery } from '@/modules/engine/services/rest.query';

export default class ReferenceWidget extends BaseWidget {
  loading = false;

  palletSettings = {
    label: 'Reference',
    icon: 'reference'
  };
  slot = { options: [] };

  constructor(settings = {}) {
    super(settings);
  }

  getEvents() {
    return {
      select(value) {
        // this.renderComponent.$emit('value', value);
      }
    };
  }

  options(h, key) {
    const list = [];
    this.slot.options.forEach(item => {
      list.push(<el-option label={item.label} value={item.value} disabled={item.disabled}/>);
    });
    return list;
  }

  overrideFieldSettings(fieldSettings) {
    const _this = this;
    return Object.assign(fieldSettings, {
      async 'remoteMethod'(queryString) {
        fieldSettings.loading = true;
        const response = await new RestQuery(_this.widgetSettings.referenced_model_alias).findAll({
          where: {
            [_this.widgetSettings.display_field_name]: {
              '$regex': queryString
            }
          },
          fields: [_this.widgetSettings.referenced_field_name, _this.widgetSettings.display_field_name]
        });
        _this.renderComponent.$set(_this.slot, 'options', response.contents.map(rec => {
          return {
            label: rec[_this.widgetSettings.display_field_name],
            value: rec[_this.widgetSettings.referenced_field_name]
          };
        }));
        fieldSettings.loading = false;
        _this.repaint();
      },
      filterable: true,
      remote: true,
      reserveKeyword: true,
      loading: false
    });
  }

  componentRender(component, h) {
    const refModel = this.formModel['ref_' + this.fieldName];
    if (refModel) {
      this.slot.options.push({
        label: refModel[this.widgetSettings.display_field_name],
        value: refModel[this.widgetSettings.referenced_field_name || 'id']
      });
    }
    return h('el-select', this.getComponentConfig(component), this.getChildren(h));
  }
}
