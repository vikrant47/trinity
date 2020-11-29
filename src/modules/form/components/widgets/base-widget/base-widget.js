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
  static defaultWidgetSettings = {
    widgetAlias: WIDGETS.input,
    span: 24,
    label: null,
    formId: null,
    layout: ITEM_LAYOUT.colFormItem,
    regList: [],
    tagIcon: 'date',
    document: null,
    required: true,
    changeTag: true,
    renderKey: null,
    showLabel: true,
    labelWidth: null,
    defaultValue: null
  };
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
  fieldName = null;
  slot = {};
  widgetAlias = 'input';
  formModel = {};
  children = [];
  palletSettings = {};
  fieldSettings = {};
  widgetSettings = {};
  configSection = {};

  /**
   * @property model: WidgetModel
   * Constructor always called before child field initialization
   * Moving initialization to init
   * */
  constructor(settings = { fieldSettings: {}, widgetSettings: {}}) {
    const fieldSettings = settings.fieldSettings;
    const widgetSettings = settings.widgetSettings;
    this.widgetClass = this.constructor.name;
    this.fieldSettings = Object.assign({}, BaseWidget.defaultFieldSettings, this.fieldSettings, this.getFieldSettings(), fieldSettings);
    this.palletSettings = Object.assign({}, BaseWidget.defaultPalletSettings, this.palletSettings, this.getPalletSettings());
    this.widgetSettings = Object.assign({}, BaseWidget.defaultWidgetSettings, this.widgetSettings, this.getWidgetSettings(), widgetSettings);
    if (!this.widgetSettings.label) {
      this.widgetSettings.label = this.palletSettings.label;
    }
    Object.assign(this.fieldSettings, settings);
  }

  getFieldSettings() {
    return {};
  }

  getPalletSettings() {
    return {};
  }

  getWidgetSettings() {
    return {};
  }

  /**
   * */
  init(settings = {}, componentConfig = {}) {
    this.updateValue();
    if (!this.fieldSettings.placeholder) {
      this.fieldSettings.placeholder = 'Please Enter ' + (this.widgetSettings.label ? this.widgetSettings.label : 'Value');
    }
  }

  updateValue() {
    if (this.formModel) {
      if (typeof this.formModel[this.fieldName] === 'undefined') {
        this.setValue(this.widgetSettings.defaultValue);
      }
    }
  }

  setFieldName(fieldName) {
    this.fieldName = fieldName;
  }

  setFormModel(formModel) {
    this.formModel = formModel;
    this.updateValue();
  }

  getValue() {
    return this.formModel[this.fieldName];
  }

  setValue(value) {
    this.formModel[this.fieldName] = value;
  }

  getConfigSectionFields() {
    return [
      {
        widgetAlias: WIDGETS.select,
        fieldName: 'type',
        widgetSettings: {
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
        widgetSettings: {
          label: 'Name',
          required: true
        }
      }, {
        fieldName: 'title',
        widgetSettings: {
          label: 'Title',
          required: true
        }
      }, {
        fieldName: 'placeholder',
        widgetSettings: {
          label: 'Placeholder'
        }
      },
      {
        fieldName: 'size',
        widgetAlias: WIDGETS.slider,
        widgetSettings: {
          label: 'Size',
          min: 0,
          max: 10
        }
      },
      {
        fieldName: 'showLabel',
        widgetAlias: WIDGETS.switch,
        widgetSettings: {
          label: 'Show Label',
          default: true
        }
      },
      {
        fieldName: 'labelWidth',
        widgetAlias: WIDGETS.number,
        widgetSettings: {
          label: 'Label Width',
          min: 0
        }
      },
      {
        fieldName: 'span',
        widgetAlias: WIDGETS.number,
        widgetSettings: {
          label: 'Span',
          min: 0,
          max: 12
        }
      },
      {
        fieldName: 'widgetIcon',
        widgetSettings: {
          label: 'Icon'
        }
      },
      {
        label: 'Required',
        widgetAlias: WIDGETS.switch,
        fieldName: 'required',
        widgetSettings: {
          default: false
        }
      }, {
        fieldName: 'layout',
        widgetAlias: WIDGETS.select,
        widgetSettings: {
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
        fieldName: 'defaultValue',
        widgetSettings: {
          label: 'Default'
        }
      },
      {
        fieldName: 'showWordLimit',
        widgetAlias: WIDGETS.switch,
        widgetSettings: {
          label: 'Show Limit'
        }
      }
    ];
  }

  loadConfigForConfigSection() {
    if (!this.configSection.widgets) {
      this.configSection.widgets = this.getConfigSectionFields().map(widgetJSON => {
        widgetJSON.widgetAlias = widgetJSON.widgetAlias ? widgetJSON.widgetAlias : WIDGETS.input;
        return new FormWidgetService().getWidgetInstance(widgetJSON, false);
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
    this.fieldSettings.name = this.fieldName;
    this.fieldSettings['v-model'] = this.formModel[this.fieldName];
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
