import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import MonacoEditor from 'vue-monaco';
import { WIDGETS } from '@/modules/form/components/widgets/base-widget/widgets';

export default class CodeEditorWidget extends BaseWidget {
  palletSettings = {
    label: 'Rich Editor',
    icon: 'edit'
  };

  overrideConfigSection(configSectionWidgets) {
    configSectionWidgets['widgetSettings.language'] = {
      fieldName: 'widgetSettings.language',
      widgetAlias: WIDGETS.select,
      slot: {
        options: [{
          label: 'Javascript', value: 'javascript'
        }, {
          label: 'Html', value: 'html'
        }, {
          label: 'Css', value: 'css'
        }, {
          label: 'Plain', value: 'plain'
        }, {
          label: 'JSON', value: 'javascript'
        }]
      }
    };
    return configSectionWidgets;
  }

  overrideWidgetSettings(widgetSettings) {
    widgetSettings = Object.assign({
      width: '400px',
      height: '200px'
    }, widgetSettings);
    return widgetSettings;
  }

  overrideFieldSettings(fieldSettings) {
    if (!fieldSettings.value) {
      fieldSettings.value = '';
    }
    return fieldSettings;
  }

  getEvents(config) {
    const _this = this;
    return {
      change(value) {
        if (typeof value === 'string' && config.parse === true) {
          try {
            value = JSON.parse(value);
          } catch (e) {
            // add validator for invalid json
          }
        }
        _this.setValue(value);
      }
    };
  }

  componentRender(component, h) {
    const config = this.getComponentConfig(component);
    let value = config.attrs.value;
    if (value && config.parse === true && typeof value !== 'string') {
      value = JSON.stringify(config.attrs.value);
    }
    const options = {
      on: this.getEvents(config),
      style: {
        width: config.width,
        height: config.height
      },
      props: {
        language: config.language,
        value: value
      }
    };
    return h('div', {
      class: 'code-editor-wrapper',
      style: {
        width: config.width,
        height: config.height
      }
    }, [h(MonacoEditor, options)]);
  }
}
