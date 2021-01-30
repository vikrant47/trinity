import { EngineForm } from '@/modules/form/engine-api/engine.form';
import { FORM_EVENTS } from '@/modules/form/engine-api/form-events';
import FormDesignerWidget from '@/modules/form/components/widgets/form-designer/form-designer-widget';
import FormDesigner from '@/modules/form/components/widgets/form-designer/designer/FormDesigner';
import Parser from '@/modules/form/components/widgets/form-designer/render/Parser';

export default class RepeaterWidget extends FormDesignerWidget {
  forms;
  palletSettings = {
    label: 'Repeater',
    icon: 'el-icon-coin'
  };
  transient = [
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
  }

  addRepeaterItem(index, itemValue) {
    const config = this.widgetSettings.repeaterConfig;
    const value = this.getValue();
    if (itemValue) {
      value[index] = itemValue;
    }
    const form = new EngineForm();
    form.setFormConfig(config);
    form.setRecord(value[index]);
    form.on(FORM_EVENTS.widget.updateValue, () => {
      value[index] = this.form.getFormData();
      this.emit('input', value);
    });
    return form;
  }
  deleteRepeaterItem(index) {
    const value = this.getValue();
    value.splice(index, 1);
    this.forms.splice(index, 1);
    this.emit('input', value);
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
        return this.addRepeaterItem(i);
      });
      return this.getRepeaterTemplate(h);
    }
  }
  getRepeaterTemplate(h) {
    return (
      <div class='repeater-wrapper'>
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
              {h(Parser, { props: { engineForm: form, evalContext: {}}})}
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
      </div>
    );
  }
}

