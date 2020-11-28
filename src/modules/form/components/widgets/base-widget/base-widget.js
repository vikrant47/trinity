import {
  ComponentConfig,
  ITEM_LAYOUT
} from '@/modules/form/components/widgets/base-widget/widget-config';
import Vue from 'vue';
import { FormWidgetService, WIDGETS } from '@/modules/form/components/widgets';

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
  slot = {};
  widgetAlias = 'input';
  formModel;
  children = [];
  palletSettings = {};
  fieldSettings = {};
  component = {};
  configSection = {};

  /**
   * @property model: WidgetModel
   * Constructor always called before child field initialization
   * Moving initialization to init
   * */
  constructor(settings = {}, componentConfig = {}) {
    this.widgetClass = this.constructor.name;
    Object.assign(this.fieldSettings, BaseWidget.defaultFieldSettings, settings, this.getFieldSettings());
    Object.assign(this.palletSettings, BaseWidget.defaultPalletSettings, this.getPalletSettings());
    Object.assign(this.component, BaseWidget.defaultComponentConfig, componentConfig, this.getComponentConfig());
    if (!this.component.label) {
      this.component.label = this.palletSettings.label;
    }
    Object.assign(this.fieldSettings, settings);
  }

  getFieldSettings() {
    return {};
  }

  getPalletSettings() {
    return {};
  }

  getComponentConfig() {
    return {};
  }

  /**
   * */
  init(settings = {}, componentConfig = {}) {
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
        fieldSettings: {
          fieldName: 'type',
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
        fieldSettings: {
          fieldName: 'name',
          label: 'Name',
          required: true
        }
      }, {
        fieldSettings: {
          fieldName: 'title',
          label: 'Title',
          required: true
        }
      }, {
        fieldSettings: {
          fieldName: 'placeholder',
          label: 'Placeholder'
        }
      },
      {
        widget: WIDGETS.slider,
        fieldSettings: {
          fieldName: 'size',
          label: 'Size',
          min: 0,
          max: 10
        }
      },
      {
        widget: WIDGETS.switch,
        fieldSettings: {
          fieldName: 'showLabel',
          label: 'Show Label',
          default: true
        }
      },
      {
        widget: WIDGETS.number,
        fieldSettings: {
          fieldName: 'labelWidth',
          label: 'Label Width',
          min: 0
        }
      },
      {
        widget: WIDGETS.number,
        fieldSettings: {
          fieldName: 'span',
          label: 'Span',
          min: 0,
          max: 12
        }
      },
      {
        fieldSettings: {
          fieldName: 'widgetIcon',
          label: 'Icon'
        }
      },
      {
        widget: WIDGETS.switch,
        fieldName: 'required',
        fieldSettings: {
          label: 'Required',
          default: false
        }
      }, {
        widget: WIDGETS.select,
        fieldSettings: {
          fieldName: 'layout',
          label: 'Layout',
          widgetIcon: 'select',
          defaultValue: ITEM_LAYOUT.colFormItem,
          required: true,
          placeholder: 'Please Select Widget'
        },
        slot: {
          options: [{
            'label': 'Column Layout',
            'value': ITEM_LAYOUT.colFormItem
          }, {
            'label': 'Row Layout',
            'value': ITEM_LAYOUT.rowFormItem
          }]
        }
      },
      {
        fieldSettings: {
          fieldName: 'defaultValue',
          label: 'Default'
        }
      },
      {
        widget: WIDGETS.switch,
        fieldSettings: {
          fieldName: 'showWordLimit',
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

  registerEvents() {

  }

  updateModel() {

  }

  getChildren(h) {
    let children = [];
    if (this.slot) {
      children = Object.keys(this.slot).map((slotKey) => {
        if (this[slotKey]) {
          if (typeof this[slotKey] === 'function') {
            return this[slotKey](h, slotKey);
          }
          return slotKey;
        }
      });
    }
    return children.reduce((children, child) => {
      if (Array.isArray(child)) {
        children = children.concat(child);
      } else if (typeof child !== 'undefined') {
        children.push(child);
      }
      return children;
    }, []);
  }

  prepareComponentConfig() {
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
    return h('el-input', this.prepareComponentConfig(), this.getChildren());
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
