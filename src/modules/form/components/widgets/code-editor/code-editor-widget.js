import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import MonacoEditor from 'vue-monaco';
import { WIDGETS } from '@/modules/form/components/widgets/base-widget/widgets';

export default class CodeEditorWidget extends BaseWidget {
  formItemConfig = {};
  palletSettings = {
    label: 'Rich Editor',
    icon: 'edit'
  };
  fullscreen = false;

  overrideConfigSection(configSectionWidgets) {
    configSectionWidgets['widgetSettings.language'] = {
      fieldName: 'widgetSettings.language',
      widgetAlias: WIDGETS.select,
      widgetSettings: {
        label: 'Language'
      },
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
          label: 'JSON', value: 'json'
        }]
      }
    };
    return configSectionWidgets;
  }

  overrideWidgetSettings(widgetSettings) {
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

  jsxRender(h) {
    const config = this.getComponentConfig();
    this.width = config.width;
    this.height = config.height;
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
        options: { automaticLayout: true },
        value: value
      }
    };
    const vEditor = h(MonacoEditor, options);
    return (<div class='code-editor-wrapper' id={'code-editor-wrapper' + this.id}>
      <el-button
        type='button'
        class='el-button'
        icon='el-icon-full-screen'
        style={{ position: 'absolute', right: '0px', top: '0px', 'z-index': '9999' }}
        onClick={event => {
          event.stopPropagation();
          // console.log(this);
          const wrapper = document.getElementById('code-editor-wrapper' + this.id);
          if (!this.fullscreen) {
            wrapper.className = 'code-editor-wrapper full-screen';
            this.fullscreen = true;
          } else {
            wrapper.className = 'code-editor-wrapper';
            this.fullscreen = false;
          }
          setTimeout(() => {
            const editor = vEditor.componentInstance.getEditor();
            editor.layout();
          }, 500);
          return false;
        }}
      />
      {vEditor}
    </div>);
  }

  componentRender(component, h) {
    return this.jsxRender(h);
  }
}
