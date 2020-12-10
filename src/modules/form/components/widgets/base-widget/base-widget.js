import {
  DEFAULT_CONFIG_SECTION,
  ITEM_LAYOUT
} from '@/modules/form/components/widgets/base-widget/widget-config';
import Vue from 'vue';
import { WIDGETS } from '@/modules/form/components/widgets/base-widget/widgets';
import _ from 'lodash';
import { Engine } from '@/modules/engine/core/engine';
import { TemplateEngine } from '@/modules/engine/core/template.engine';

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
    defaultValue: null,
    class: {},
    domProps: {},
    nativeOn: {},
    on: {},
    style: {},
    directives: [],
    scopedSlots: {},
    slot: null,
    key: null,
    ref: null,
    refInFor: true,
    visible: true,
    triggers: []
  };
  static defaultFieldSettings = {
    disabled: false,
    readonly: false,
    clearable: true,
    placeholder: '',
    filterable: true,
    min: undefined,
    max: undefined,
    step: 1,
    showStops: false,
    range: false,
    multiple: false
  };
  designMode = false;
  transient = ['configSection', 'evalContext'];
  fieldName = null;
  slot = {};
  events = {};
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
  renderComponent; // reference of render component
  componentConfig = {};// final component config
  evalContext = {};// context to store variable for evaluations
  /**
   * @property model: WidgetModel
   * Constructor always called before child field initialization
   * Moving initialization to init
   * */
  constructor() {
    // Object.assign(this, settings);
    this.widgetClass = this.constructor.name;
    this.fieldSettings = Object.assign({}, BaseWidget.defaultFieldSettings, this.getFieldSettings());
    this.palletSettings = Object.assign({}, BaseWidget.defaultPalletSettings, this.getPalletSettings());
    this.widgetSettings = Object.assign({}, BaseWidget.defaultWidgetSettings, this.getWidgetSettings());
    this.unmarshall({});
  }

  getFieldName() {
    if (!this.fieldName) {
      throw new Error('fieldName not defined for widget -> ' + Engine.serialize(this));
    }
    return this.fieldName;
  }

  getEvents() {
    return this.events;
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
    if (settings.widgetAlias) {
      this.widgetAlias = settings.widgetAlias;
    }
    if (settings.fieldName) {
      this.fieldName = settings.fieldName;
    }
    if (settings.slot) {
      this.slot = settings.slot;
    }
    if (settings.children) {
      this.children = settings.children;
    }
    Object.assign(this.fieldSettings, settings.fieldSettings);
    Object.assign(this.palletSettings, settings.palletSettings);
    Object.assign(this.widgetSettings, settings.widgetSettings);
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
      const value = this.getValue();
      if (typeof value === 'undefined') {
        console.warn('Unable to update value for field name ', this.fieldName, this);
      }
      if (this.componentConfig.attrs) {
        this.componentConfig.attrs.value = value;
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
    this.updateValue();
    if (this.renderComponent) {
      // this.component.$emit('input', value); // setting value in form-item by emitting input event
    } else {
      console.warn('Unable to emit value. No render component reference found in widget', this);
    }
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
    const marshalledWidget = this.marshall();
    return new this.constructor().unmarshall(Engine.clone(marshalledWidget));
  }

  getConfigSectionFields() {
    return DEFAULT_CONFIG_SECTION;
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

  getComponentConfig(component) {
    const fieldSettings = this.fieldSettings;
    fieldSettings.name = this.fieldName;
    const config = Object.assign({ attrs: fieldSettings, on: {}}, Engine.clone(this.widgetSettings));
    // this.fieldSettings['value'] = this.formModel[this.fieldName];
    // this.fieldSettings['v-model'] = this.fieldName;
    fieldSettings.value = _.get(this.formModel, this.fieldName);

    config.on.input = val => {
      this.getMethods(); // TODO: remove this - just reference for debugging
      component.$emit('input', val);
    };
    Object.assign(config.on, this.getEvents());
    // console.log('setting value for field ', this.fieldName, this.formModel, config);
    this.componentConfig = config;
    return this.componentConfig;
  }

  /** This will trigger the update event to parent components*/
  update() {
    this.renderComponent.$emit('widgetUpdate', this);
  }
  /** set render component instance*/
  setRenderComponent(renderComponent) {
    this.renderComponent = renderComponent;
  }
  setEvalContext(evalContext) {
    this.evalContext = evalContext;
  }

  buildContext() {
    return Object.assign({}, this.evalContext, {
      form: this.formModel,
      widget: this
    });
  }

  handleTriggers() {
    let triggers = this.widgetSettings.triggers;
    if (triggers) {
      if (!Array.isArray(triggers)) {
        triggers = [triggers];
      }
      for (const trigger of triggers) {
        if (trigger.action === 'show' || trigger.action === 'hide') {
          const result = TemplateEngine.evalExpression(trigger.condition, this.buildContext());
          this.widgetSettings.visible = trigger.action === 'show' ? result : !result;
        }
      }
      this.update();
    }
  }

  /** Lifecycle events*/
  mounted() {

  }

  beforeRender() {
  }

  afterRender() {
    this.handleTriggers();
  }

  beforeCreate(component) {
    // component.widget.applyConfig(component.config);
  }

  componentRender(component, h) {
    return h('el-input', this.getComponentConfig(component), this.getChildren(h));
  }

  getMethods() {
    return {};
  }

  /** This method will return cue component object*/
  getVueComponent() {
    const _this = this;
    if (!this.renderComponent) {
      this.renderComponent = Vue.component({
        name: this.constructor.name,
        props: {
          model: {
            type: Object,
            required: true,
            default() {
              return {};
            }
          }
        },
        created() {
          _this.componentCreated(this);
        },
        methods: _this.getMethods(),
        render(h) {
          return _this.componentRender(this, h);
        }
      });
    }
    return this.renderComponent;
  }
}
