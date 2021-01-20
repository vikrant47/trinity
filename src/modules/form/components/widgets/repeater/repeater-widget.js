import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import DraggableItem from '@/modules/form/components/widgets/form-designer/designer/DraggableItem';
import Parser from '@/modules/form/components/widgets/form-designer/render/Parser';
import { EngineForm } from '@/modules/form/engine-api/engine.form';
import { FORM_EVENTS } from '@/modules/form/engine-api/form-events';

export default class RepeaterWidget extends BaseWidget {
  palletSettings = {
    label: 'Repeater',
    icon: 'el-icon-coin'
  };

  overrideWidgetSettings(widgetSettings) {
    if (!widgetSettings.repeaterConfig) {
      widgetSettings.repeaterConfig = { widgets: [] };
    }
  }

  componentRender(component, h) {
    const config = this.getComponentConfig(component);
    const options = {
      props: {
        height: this.heights[config.attrs.size] || this.heights.small,
        value: config.attrs.value
      }
    };
    if (this.designMode) {
      return h(DraggableItem, options, this.getChildren());
    } else {
      const config = this.widgetSettings.repeaterConfig;
      const value = this.getValue() || [];
      return h('<div>', {}, value.map((record) => {
        const widgetConfigForm = new EngineForm();
        widgetConfigForm.setFormConfig(config);
        widgetConfigForm.setRecord(record);
        widgetConfigForm.on(FORM_EVENTS.widget.updateValue, () => {
          this.$emit('input', value);
        });
        return h(Parser, {
          props: {
            engineForm: widgetConfigForm
          }
        });
      }));
    }
  }
}
