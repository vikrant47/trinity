import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import { RestQuery } from '@/modules/engine/services/rest.query';
import { WIDGETS } from '@/modules/form/components/widgets/base-widget/widgets';
import { EngineScript } from '@/modules/engine/core/engine.script';

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

  overrideConfigSection(configSectionWidgets) {
    configSectionWidgets['fieldSettings.interceptor'] = {
      fieldName: 'fieldSettings.interceptor',
      widgetAlias: WIDGETS.codeEditor,
      widgetSettings: {
        labelWidth: 0,
        span: 24,
        label: 'Interceptor',
        advance: true,
        language: 'javascript'
      }
    };
    return configSectionWidgets;
  }

  overrideFieldSettings(fieldSettings) {
    const _this = this;
    if (!fieldSettings.interceptor) {
      fieldSettings.interceptor = async(query, resolve) => {
        return await resolve(query);
      };
    } else {
      const interceptor = fieldSettings.interceptor;
      fieldSettings.interceptor = (query, resolve) => {
        return new EngineScript({ script: interceptor }).execute({ query, resolve }, this.buildContext());
      };
    }
    return Object.assign(fieldSettings, {
      async remoteMethod(value) {
        fieldSettings.loading = true;
        const result = await fieldSettings.interceptor({
          where: {
            [_this.widgetSettings.display_field_name]: {
              '$regex': value
            }
          },
          fields: [_this.widgetSettings.referenced_field_name, _this.widgetSettings.display_field_name]
        }, async(query) => {
          const response = await new RestQuery(_this.widgetSettings.referenced_model_alias).findAll(query);
          return response.contents;
        });
        _this.renderComponent.$set(_this.slot, 'options', result.map(rec => {
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
