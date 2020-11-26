import {
  ComponentConfig,
  ITEM_LAYOUT,
  WidgetConfig
} from '@/modules/form/components/widgets/base-widget/widget-config';
import Vue from 'vue';
import { FormWidgetService, WIDGETS } from '@/modules/form/components/widgets';
import { FormService } from '@/modules/form/services/form.service';

export class BaseWidget {
  static defaultPalletSettings = {
    label: 'Input',
    icon: 'input'
  };
  static defaultComponentConfig = new ComponentConfig();
  static defaultFieldSettings = {
    disabled: false,
    readonly: false,
    clearable: true,
    placeholder: '',
    filterable: true,
    min: null,
    max: null,
    step: 1,
    showStops: false,
    range: false,
    multiple: false,
    fieldName: null,
    class: {},
    attrs: {},
    props: {},
    domProps: {},
    nativeOn: {},
    on: {},
    style: {},
    directives: [],
    scopedSlots: {},
    slot: null,
    key: null,
    ref: null,
    refInFor: true
  };
  widgetAlias = 'input';
  formModel;
  children = [];
  palletSettings = {};
  fieldSettings = {};
  component = new ComponentConfig();
  configSection = {};

  /** @property model: WidgetModel*/
  constructor(settings = {}) {
    Object.assign(this.fieldSettings, BaseWidget.defaultFieldSettings);
    Object.assign(this.palletSettings, BaseWidget.defaultPalletSettings);
    Object.assign(this.component, BaseWidget.defaultComponentConfig);
    Object.assign(this.fieldSettings, settings);
    this.widgetClass = this.constructor.name;
  }

  init() {
    if (this.formModel) {
      if (typeof this.formModel[this.fieldSettings.fieldName] === 'undefined') {
        this.setValue(this.fieldSettings.defaultValue);
      }
    }
    if (!this.fieldSettings.placeholder) {
      this.fieldSettings.placeholder = 'Please Enter ' + (this.fieldSettings.label ? this.fieldSettings.label : 'Value');
    }
  }

  setFieldName(fieldName) {
    this.fieldName = fieldName;
  }

  setFormModel(formModel) {
    this.formModel = formModel;
  }

  getValue() {
    return this.formModel[this.fieldSettings.fieldName];
  }

  setValue(value) {
    this.formModel[this.fieldSettings.fieldName] = value;
  }

  getConfigSectionFields() {
    return [
      {
        widget: WIDGETS.select,
        fieldName: 'type',
        component: {
          label: 'Widget',
          widgetIcon: 'select',
          defaultValue: 'string',
          required: true
        },
        slot: {
          options: []
        },
        placeholder: 'Please Select Widget'
      }, {
        fieldName: 'name',
        component: {
          label: 'Name',
          required: true
        }
      }, {
        fieldName: 'title',
        component: {
          label: 'Title',
          required: true
        }
      }, {
        fieldName: 'placeholder',
        component: {
          label: 'Placeholder'
        }
      },
      {
        widget: WIDGETS.slider,
        fieldName: 'size',
        component: {
          label: 'Size'
        },
        min: 0,
        max: 10
      },
      {
        fieldName: 'showLabel',
        widget: WIDGETS.switch,
        component: {
          label: 'Show Label'
        },
        default: true
      },
      {
        widget: WIDGETS.number,
        fieldName: 'labelWidth',
        component: {
          label: 'Label Width'
        },
        min: 0
      },
      {
        fieldName: 'span',
        widget: WIDGETS.number,
        component: {
          label: 'Span'
        },
        min: 0,
        max: 12
      },
      {
        fieldName: 'widgetIcon',
        component: {
          label: 'Icon'
        }
      },
      {
        widget: WIDGETS.switch,
        fieldName: 'required',
        component: {
          label: 'Required'
        },
        default: false
      }, {
        widget: WIDGETS.select,
        fieldName: 'layout',
        component: {
          label: 'Layout',
          widgetIcon: 'select',
          defaultValue: ITEM_LAYOUT.colFormItem,
          required: true
        },
        slot: {
          options: [{
            'label': 'Column Layout',
            'value': ITEM_LAYOUT.colFormItem
          }, {
            'label': 'Row Layout',
            'value': ITEM_LAYOUT.rowFormItem
          }]
        },
        placeholder: 'Please Select Widget'
      },
      {
        fieldName: 'defaultValue',
        component: {
          label: 'Default'
        }
      },
      {
        widget: WIDGETS.switch,
        fieldName: 'showWordLimit',
        component: {
          label: 'Show Limit'
        }
      }
    ];
  }

  loadConfigForConfigSection() {
    if (!this.configSection.fields) {
      this.configSection.fields = this.getConfigSectionFields().map(conf => {
        const Widget = new FormWidgetService().getWidgetByAlias(conf.widget || 'input');
        return new Widget(conf);
      });
    }
    return this.configSection;
  }

  getSection() {
    return 'Primary';
  }

  getData() {
    return {};
  }

  getComponent() {
    return 'el-input';
  }

  registerEvents() {

  }

  updateModel() {

  }

  getChildren() {
    return this;
  }

  getVueConfig() {
    this.init();
    this.fieldSettings.name = this.fieldSettings.fieldName;
    return JSON.parse(JSON.stringify(this.fieldSettings));
  }

  applyConfig(widgetConfig) {
    Object.assign(this.fieldSettings, widgetConfig);
    this.init();
  }

  componentCreated(component) {
    component.widget.applyConfig(component.config);
  }

  componentRender(component, h) {
    return h(this.getComponent(), { attrs: this.getVueConfig() }, this.getChildren());
  }

  /** This method will return cue component object*/
  getVueComponent() {
    const _this = this;
    return Vue.component({
      name: this.constructor.name,
      props: {
        config: {
          type: Object,
          required: true,
          default() {
            return {};
          }
        }
      },
      data: function() {
        return {
          widget() {
            return _this;
          }
        };
      },
      created() {
        _this.componentCreated(this);
      },
      render(h) {
        return _this.render(this, h);
      }
    });
  }
}
