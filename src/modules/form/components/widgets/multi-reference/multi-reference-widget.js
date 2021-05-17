import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import { RestQuery } from '@/modules/engine/services/rest.query';
import { WIDGETS } from '@/modules/form/components/widgets/base-widget/widgets';
import { EngineScript } from '@/modules/engine/core/engine.script';

export default class MultiReferenceWidget extends BaseWidget {
  loading = false;

  palletSettings = {
    label: 'Multi Reference',
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
    if (!this.isWidgetWithField()) {
      Object.assign(configSectionWidgets, {
        'widgetSettings.relation_type': {
          fieldName: 'widgetSettings.relation_type',
          widgetAlias: WIDGETS.select,
          widgetSettings: {
            labelWidth: 100,
            span: 24,
            label: 'Relation Type',
            advance: true
          },
          slot: {
            options: [{
              label: 'Belongs To Many',
              value: 'belongs_to_many'
            }, {
              label: 'Morph To Many',
              value: 'morph_to_many'
            }]
          }
        },
        'widgetSettings.referenced_model_alias': {
          fieldName: 'widgetSettings.referenced_model_alias',
          widgetAlias: WIDGETS.reference,
          widgetSettings: {
            labelWidth: 100,
            span: 24,
            label: 'Reference Model',
            advance: true,
            referenced_model_alias: 'engine_models',
            referenced_field_name: 'alias',
            display_field_name: 'label'
          }
        },
        'widgetSettings.referenced_field_name': {
          fieldName: 'widgetSettings.referenced_field_name',
          widgetAlias: WIDGETS.reference,
          widgetSettings: {
            labelWidth: 100,
            span: 24,
            label: 'Reference Field',
            advance: true,
            referenced_model_alias: 'engine_fields',
            referenced_field_name: 'name',
            display_field_name: 'label'
          }
        },
        'widgetSettings.display_field_name': {
          fieldName: 'widgetSettings.display_field_name',
          widgetAlias: WIDGETS.reference,
          widgetSettings: {
            labelWidth: 100,
            span: 24,
            label: 'Display Field',
            advance: true,
            referenced_model_alias: 'engine_fields',
            referenced_field_name: 'name',
            display_field_name: 'label'
          }
        },
        'widgetSettings.through_model_alias': {
          fieldName: 'widgetSettings.through_model_alias',
          widgetAlias: WIDGETS.reference,
          widgetSettings: {
            labelWidth: 100,
            span: 24,
            label: 'Through Model',
            advance: true,
            referenced_model_alias: 'engine_models',
            referenced_field_name: 'name',
            display_field_name: 'label'
          }
        },
        'widgetSettings.through_source_field_name': {
          fieldName: 'widgetSettings.through_source_field_name',
          widgetAlias: WIDGETS.reference,
          widgetSettings: {
            labelWidth: 100,
            span: 24,
            label: 'Through Source Field',
            advance: true,
            referenced_model_alias: 'engine_fields',
            referenced_field_name: 'name',
            display_field_name: 'label'
          }
        },
        'widgetSettings.through_target_field_name': {
          fieldName: 'widgetSettings.through_target_field_name',
          widgetAlias: WIDGETS.reference,
          widgetSettings: {
            labelWidth: 100,
            span: 24,
            label: 'Through Target Field',
            advance: true,
            referenced_model_alias: 'engine_fields',
            referenced_field_name: 'name',
            display_field_name: 'label'
          }
        }
      });
    }
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
      props: {
        key: _this.widgetSettings.through_target_field_id,
        label: _this.widgetSettings.display_field_name
      },
      filterable: true,
      remote: true,
      reserveKeyword: true,
      loading: false
    });
  }

  async mounted() {
    this.loading = true;
    const result = await new RestQuery(this.widgetSettings.referenced_model_alias).findAll({
      fields: ['id', this.widgetSettings.referenced_display_field],
      include: [{
        fields: ['id'],
        reference: this.widgetSettings.through_referenced_field,
        modelAlias: this.widgetSettings.through_model_alias,
        required: false,
        where: {
          [this.widgetSettings.through_source_field]: this.widgetSettings.source_field_value
        }
      }]
    });
    this.multiReferenceData = result.contents;
    super.mounted();
    this.loading = false;
    this.repaint();
  }

  componentRender(component, h) {
    //  await this.waitFor('mounted');
    const config = this.getComponentConfig(component);
    Object.assign(config.attrs, {
      data: this.multiReferenceData,
      titles: ['Available', 'Selected'],
      props: {
        key: 'id',
        label: this.widgetSettings.referenced_display_field
      },
      'v-loading': this.loading
    });
    return h('el-transfer', config, this.getChildren(h));
  }
}
