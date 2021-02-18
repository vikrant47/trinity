import { EngineForm } from '@/modules/form/engine-api/engine.form';
import FormDesignerWidget from '@/modules/form/components/widgets/form-designer/form-designer-widget';
import FormDesigner from '@/modules/form/components/widgets/form-designer/designer/FormDesigner';
import Parser from '@/modules/form/components/widgets/form-designer/render/Parser';
import { WIDGETS } from '@/modules/form/components/widgets/base-widget/widgets';
import draggable from 'vuedraggable';

export default class RepeaterWidget extends FormDesignerWidget {
  forms;
  palletSettings = {
    label: 'Repeater',
    icon: 'el-icon-coin'
  };
  transient = [
    'transient',
    'forms',
    'configSection',
    'evalContext',
    'transient',
    'eventSeen',
    'events',
    'waitPromises',
    'evalContext',
    'data',
    'componentConfig',
    'fieldSettings..*',
    'widgetSettings..*'
  ];

  overrideWidgetSettings(widgetSettings) {
    if (!widgetSettings.repeaterConfig) {
      widgetSettings.repeaterConfig = { widgets: [] };
    }
    return widgetSettings;
  }
  unmarshallWidgets(widgets) {
    return widgets.map((marshalledWidget) => {
      marshalledWidget.widgetAlias = marshalledWidget.widgetAlias ? marshalledWidget.widgetAlias : WIDGETS.input;
      const FormWidgetService = require('../../../services/form.widget.service').FormWidgetService;
      const widget = new FormWidgetService().getWidgetInstance(marshalledWidget);
      return widget;
    });
  }
  buildRepeaterItem(index, itemValue) {
    const config = this.widgetSettings.repeaterConfig;
    const value = this.getValue();
    if (itemValue) {
      value[index] = itemValue;
    }
    const form = new EngineForm();
    form.setFormConfig({ widgets: this.unmarshallWidgets(config.widgets) });
    form.setRecord(value[index]);
    return form;
  }
  addRepeaterItem(index, itemValue) {
    this.buildRepeaterItem(index, itemValue);
    const value = this.getValue();
    this.setValue(value);
  }
  deleteRepeaterItem(index) {
    const value = this.getValue();
    value.splice(index, 1);
    this.forms.splice(index, 1);
    this.setValue(value);
  }

  componentRender(component, h) {
    // const config = this.getComponentConfig(component);
    if (this.designMode) {
      return h(FormDesigner, {
        on: {
          input: (value) => {
            this.widgetSettings.repeaterConfig = value;
            this.syncConfig('widgetSettings.repeaterConfig');
          }
        },
        props: {
          showPallet: false,
          value: this.widgetSettings.repeaterConfig,
          pallet: []
        }
      }, this.getChildren());
    } else {
      const value = this.getValue() || [];
      this.forms = value.map((record, i) => {
        return this.buildRepeaterItem(i);
      });
      return this.getRepeaterTemplate(h);
    }
  }
  getRepeaterTemplate(h) {
    return (
      <draggable class='repeater-wrapper' list={this.getValue()} animation='340' onChange={() => {
        const value = this.getValue() || [];
        this.setValue(value);
        this.repaint();
      }}>
        {this.forms.map((form, index) => {
          return (
            <div class='repeater-item'>
              <button class='close-btn' type='button' title='Delete' onClick={event => {
                this.deleteRepeaterItem(index, form);
                this.repaint();
                event.stopPropagation();
              }}>
                <i class='el-icon-close'/>
              </button>
              {h(Parser, { props: { engineForm: form, evalContext: {}}, on: {
                fieldValueUpdated: () => {
                  const value = this.getValue() || [];
                  value[index] = form.getRecord();
                  this.setValue(value);
                } }})}
            </div>
          );
        })}
        <el-button title='Add' size='mini' type='primary' onClick={event => {
          this.addRepeaterItem(this.forms.length, {});
          this.repaint();
          event.stopPropagation();
        }}>
          <i className='el-icon-document-add'/>
          Add
        </el-button>
      </draggable>
    );
  }
}

