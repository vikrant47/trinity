import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import { RestQuery } from '@/modules/engine/services/rest.query';

export default class ReferenceWidget extends BaseWidget {
  loading = false;

  palletSettings = {
    label: 'Reference',
    icon: 'reference'
  };
  slot = { options: [] };

  valueInitialized = false;

  constructor(settings = {}) {
    super(settings);
  }

  init() {
    super.init();
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
    if (!this.valueInitialized) {
      const refModel = this.formModel['ref_' + this.fieldName];
      if (refModel) {
        const value = refModel[this.widgetSettings.referenced_field_name || 'id'];
        if (this.slot.options.findIndex(option => option.value === value) < 0) {
          this.slot.options.push({
            label: refModel[this.widgetSettings.display_field_name],
            value: value
          });
        }
        this.valueInitialized = true;
      }
    }
    return h('el-select', this.getComponentConfig(component), this.getChildren(h));
  }
}
