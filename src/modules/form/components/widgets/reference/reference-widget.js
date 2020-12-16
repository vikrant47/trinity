import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import { RestQuery } from '@/modules/engine/services/rest.query';

export default class ReferenceWidget extends BaseWidget {
  loading = false;

  palletSettings = {
    label: 'Reference',
    icon: 'reference'
  };

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
        const data = await new RestQuery(_this.widgetSettings.targetModel).findAll({
          where: {
            [_this.widgetSettings.displayField]: {
              '$regex': queryString
            }
          },
          fields: [_this.widgetSettings.key, _this.widgetSettings.displayField]
        });
        _this.renderComponent.$set(_this.slot, 'options', data.map(rec => {
          return {
            label: rec[_this.widgetSettings.displayField],
            value: rec[_this.widgetSettings.key]
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
    return h('el-select', this.getComponentConfig(component), this.getChildren(h));
  }
}
