import {
  ITEM_LAYOUT
} from '@/modules/form/components/widgets/base-widget/widget-config';
import Vue from 'vue';
import { WIDGETS } from '@/modules/form/components/widgets/base-widget/widgets';
import _ from 'lodash';
import { Engine } from '@/modules/engine/core/engine';

export class BaseWidget {
  static defaultPalletSettings = {
    label: 'Input',
    icon: 'input'
  };
  static defaultWidgetSettings = {
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
  transient = ['configSection'];
  fieldName = null;
  slot = {};
  widgetAlias = 'input';
  formModel;
  children = [];
  palletSettings = {};
  fieldSettings = {};
  widgetSettings = {};
  configSection = {
    model: {},
    widgets: [],
    rules: {} // will store all error messages
  };
  widgetClass = null;

  /**
   * @property model: WidgetModel
   * Constructor always called before child field initialization
   * Moving initialization to init
   * */
  constructor() {
    // Object.assign(this, settings);
    this.widgetClass = this.constructor.name;
    this.unmarshall({});
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
  unmarshall(settings = {}) {
    if (settings.fieldName) {
      this.fieldName = settings.fieldName;
    }
    if (settings.slot) {
      this.slot = settings.slot;
    }
    if (settings.children) {
      this.children = settings.children;
    }
    this.fieldSettings = _.assign(
      {},
      BaseWidget.defaultFieldSettings,
      this.getFieldSettings(),
      settings.fieldSettings
    );
    this.palletSettings = _.assign(
      {}, BaseWidget.defaultPalletSettings, this.getPalletSettings(), settings.palletSettings
    );
    this.widgetSettings = _.assign(
      { renderKey: new Date().getTime() }, BaseWidget.defaultWidgetSettings, this.getWidgetSettings(), settings.widgetSettings
    );
    if (!this.widgetSettings.label) {
      this.widgetSettings.label = this.palletSettings.label;
    }
    if (settings.formModel) {
      this.setFormModel(settings.formModel);
    }
    if (!this.fieldSettings.placeholder) {
      this.fieldSettings.placeholder = 'Please Enter ' + (this.widgetSettings.label ? this.widgetSettings.label : 'Value');
    }
    return this;
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
    this.updateValue();
  }

  setFormModel(formModel) {
    this.formModel = formModel;
    this.updateValue();
  }

  getFormModel() {
    return this.formModel;
  }

  getValue() {
    return _.get(this.formModel, this.fieldName);
  }

  setValue(value) {
    _.set(this.formModel, this.fieldName, value);
  }

  marshall() {
    return Engine.marshall(Object.assign({}, this, {
      configSection: null,
      formModel: {
        [this.fieldName]: this.formModel && this.formModel[this.fieldName] || null,
        marshall: null
      }
    }));
  }

  clone() {
    return this.unmarshall(JSON.parse(JSON.stringify(this.marshall())));
  }

  getConfigSectionFields() {
    return [
      {
        widgetAlias: WIDGETS.select,
        fieldName: 'widgetAlias',
        fieldSettings: {
          placeholder: 'Please Select Widget'
        },
        widgetSettings: {
          label: 'Widget',
          widgetIcon: 'select',
          defaultValue: 'string',
          required: true
        },
        slot: {
          options: Object.keys(WIDGETS).map((widgetName) => {
            return {
              label: _.camelCase(WIDGETS[widgetName]),
              value: widgetName
            };
          })
        }
      }, {
        fieldName: 'fieldName',
        widgetSettings: {
          label: 'Name',
          required: true
        }
      }, {
        fieldName: 'fieldSettings.title',
        widgetSettings: {
          label: 'Title',
          required: true
        }
      }, {
        fieldName: 'fieldSettings.placeholder',
        widgetSettings: {
          label: 'Placeholder'
        }
      },
      {
        fieldName: 'fieldSettings.size',
        widgetAlias: WIDGETS.slider,
        widgetSettings: {
          label: 'Size',
          min: 0,
          max: 10
        }
      },
      {
        fieldName: 'widgetSettings.showLabel',
        widgetAlias: WIDGETS.switch,
        widgetSettings: {
          label: 'Show Label',
          default: true
        }
      },
      {
        fieldName: 'widgetSettings.labelWidth',
        widgetAlias: WIDGETS.number,
        widgetSettings: {
          label: 'Label Width',
          min: 0
        }
      },
      {
        fieldName: 'fieldSettings.span',
        widgetAlias: WIDGETS.number,
        widgetSettings: {
          label: 'Span',
          min: 0,
          max: 12
        }
      },
      {
        fieldName: 'fieldSettings.icon',
        widgetSettings: {
          label: 'Icon'
        }
      },
      {
        label: 'Required',
        widgetAlias: WIDGETS.switch,
        fieldName: 'fieldSettings.required',
        widgetSettings: {
          default: false
        }
      }, {
        fieldName: 'widgetSettings.layout',
        widgetAlias: WIDGETS.select,
        fieldSettings: {
          required: true,
          placeholder: 'Please Select Widget'
        },
        widgetSettings: {
          label: 'Layout',
          widgetIcon: 'select',
          defaultValue: ITEM_LAYOUT.colFormItem
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
        fieldName: 'widgetSettings.defaultValue',
        widgetSettings: {
          label: 'Default'
        }
      },
      {
        fieldName: 'fieldSettings.showWordLimit',
        widgetAlias: WIDGETS.switch,
        widgetSettings: {
          label: 'Show Limit'
        }
      }
    ];
  }

  loadConfigForConfigSection() {
    if (this.configSection.widgets.length === 0) {
      this.configSection.widgets = this.getConfigSectionFields().map(marshalledWidget => {
        marshalledWidget.widgetAlias = marshalledWidget.widgetAlias ? marshalledWidget.widgetAlias : WIDGETS.input;
        const FormWidgetService = require('../../../services/form.widget.service').FormWidgetService;
        const widget = new FormWidgetService().getWidgetInstance(marshalledWidget);
        return widget;
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

  getComponentAttrs(component) {
    const fieldSettings = JSON.parse(JSON.stringify(this.fieldSettings));
    fieldSettings.name = this.fieldName;
    // this.fieldSettings['value'] = this.formModel[this.fieldName];
    // this.fieldSettings['v-model'] = this.fieldName;
    fieldSettings.props.value = this.formModel[this.fieldName];
    fieldSettings.on.input = val => {
      component.$emit('input', val);
    };
    return fieldSettings;
  }

  getComponentProps() {
    return { value: this.formModel[this.fieldName] };
  }

  getComponentConfig() {
    return {
      attrs: this.getComponentAttrs(),
      props: this.getComponentProps()
    };
  }

  componentCreated(component) {
    // component.widget.applyConfig(component.config);
  }

  componentRender(component, h) {
    return h('el-input', this.getComponentAttrs(component), this.getChildren(h));
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
