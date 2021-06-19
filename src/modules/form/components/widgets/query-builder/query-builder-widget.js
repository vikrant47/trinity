import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import { WIDGETS } from '@/modules/form/components/widgets/base-widget/widgets';
import { RestQuery } from '@/modules/engine/services/rest.query';
import { Engine } from '@/modules/engine/core/engine';

export default class QueryBuilderWidget extends BaseWidget {
  palletSettings = {
    label: 'Icon',
    icon: 'icon'
  };

  overrideConfigSection(configSectionWidgets) {
    return Object.assign(configSectionWidgets, {
      'widgetSettings.model_alias': {
        fieldName: 'widgetSettings.model_alias',
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
      'widgetSettings.showApply': {
        fieldName: 'widgetSettings.showApply',
        widgetAlias: WIDGETS.switch,
        widgetSettings: {
          labelWidth: 100,
          span: 24,
          label: 'Show Apply',
          advance: true
        }
      },
      'widgetSettings.fields': {
        widgetAlias: WIDGETS.codeEditor,
        fieldName: 'widgetSettings.fields',
        widgetSettings: {
          labelWidth: 0,
          span: 24,
          label: 'Fields',
          required: false,
          language: 'json'
        }
      }
    });
  }

  modelAlias;
  fields = [];

  async getFields() {
    if (this.widgetSettings.fields) {
      this.fields = JSON.parse(this.widgetSettings.fields);
    } else if (this.widgetSettings.model) {
      let model = this.widgetSettings.model;
      if (model.startsWith('$')) {
        model = this.engineForm.getValue(model.substring(1));
      }
      if (this.modelAlias !== model) {
        this.modelAlias = model;
        const result = await new RestQuery('engine_fields').findAll({
          where: {
            [Engine.isUUID(model) ? 'engine_model_alias' : 'engine_model_id']: model
          }
        });
        this.fields = result.contents;
      }
      return this.fields;
    }
  }

  async jsxRender() {
    const value = this.getValue();
    const fields = await this.getFields();
    return (<div class='query-builder-wrapper'>
      <query-builder value={value} fields={fields}/>
    </div>);
  }

  componentRender(component, h) {
    return this.jsxRender(h);
  }
}
