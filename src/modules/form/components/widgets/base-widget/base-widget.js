import {
  DEFAULT_CONFIG_SECTION,
  ITEM_LAYOUT
} from '@/modules/form/components/widgets/base-widget/widget-config';
import Vue from 'vue';
import { WIDGETS } from '@/modules/form/components/widgets/base-widget/widgets';
import _ from 'lodash';
import { Engine } from '@/modules/engine/core/engine';
import { TemplateEngine } from '@/modules/engine/core/template.engine';
import { EngineObservable } from '@/modules/engine/core/engine.observable';

export class BaseWidget extends EngineObservable {
  static defaultpalletSettings = {
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
    labelSuffix: '',
    labelWidth: '100',
    labelPosition: 'right',
    formModel: 'formModel', // name of the for model key
    formRules: 'formRules',
    model: {},
    widgets: [],
    rules: {} // will store all error messages
  };
  widgetClass = null;
  renderComponent; // reference of render component
  componentConfig = {};// final component config
  evalContext = {};// context to store variable for evaluations
  formItemConfig = {};
  wrapperConfig = {};
  engineForm;
  data = {}; // a widget data is temporary storage and can be wiped out on widget re-render
  /**
   * @property model: WidgetModel
   * Constructor always called before child field initialization
   * Moving initialization to init
   * */
  constructor() {
    super();
    // Object.assign(this, settings);
    this.widgetClass = this.constructor.name;
    this.fieldSettings = Object.assign({}, BaseWidget.defaultFieldSettings, this.fieldSettings);
    this.palletSettings = Object.assign({}, BaseWidget.defaultPalletSettings, this.palletSettings);
    this.widgetSettings = Object.assign({}, BaseWidget.defaultWidgetSettings, this.widgetSettings);
  }

  setEngineForm(engineForm) {
    this.engineForm = engineForm;
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

  overrideFieldSettings(fieldSettings) {
    return fieldSettings;
  }

  overridePalletSettings(palletSettings) {
    return palletSettings;
  }

  overrideWidgetSettings() {
    return {};
  }

  updateValue() {
    if (this.formModel) {
      const value = this.getValue();
      if (typeof value === 'undefined') {
        console.warn('Unable to update value for fieldName ', this.fieldName, this);
      }
      if (this.componentConfig.attrs) {
        this.componentConfig.attrs.value = value;
      }
    }
  }

  setFieldName(fieldName) {
    this.fieldName = fieldName;
    // this.updateValue();
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

  setData(data) {
    this.data = data;
  }

  getData() {
    return this.data;
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

  getWrapperConfig() {
    Object.assign(this.wrapperConfig, {
      attrs: {
        span: this.widgetSettings.span
      },
      style: {
        display: this.widgetSettings.visible ? 'block' : 'none'
      }
    });
    return this.wrapperConfig;
  }

  getFormItemConfig() {
    let labelWidth = this.widgetSettings.labelWidth ? `${this.widgetSettings.labelWidth}px` : null;
    if (this.widgetSettings.showLabel === false) labelWidth = '0';
    Object.assign(this.formItemConfig, {
      attrs: {
        labelWidth: labelWidth,
        prop: this.fieldName,
        label: this.widgetSettings.showLabel ? this.widgetSettings.label : '',
        required: this.widgetSettings.required
      }
    });
    return this.formItemConfig;
  }

  getComponentConfig() {
    const widgetSettings = Engine.clone(this.widgetSettings, true);
    const fieldSettings = Engine.clone(this.fieldSettings, true);
    this.overrideFieldSettings(fieldSettings);
    this.overrideWidgetSettings(widgetSettings);
    fieldSettings.name = this.fieldName;
    Object.assign(this.componentConfig, { attrs: fieldSettings, on: {}}, widgetSettings);
    // this.fieldSettings['value'] = this.formModel[this.fieldName];
    // this.fieldSettings['v-model'] = this.fieldName;
    fieldSettings.value = _.get(this.formModel, this.fieldName);
    if (typeof fieldSettings.value === 'undefined') {
      fieldSettings.value = widgetSettings.defaultValue;
    }
    this.componentConfig.on.input = val => {
      this.getMethods(); // TODO: remove this - just reference for debugging
      this.renderComponent.$emit('input', val);
    };
    Object.assign(this.componentConfig.on, this.getEvents());
    // console.log('setting value for field ', this.fieldName, this.formModel, config);
    return this.componentConfig;
  }

  /** This will trigger the update event to parent components*/
  update() {
    this.getWrapperConfig(); // updating the configs
    this.getFormItemConfig();// updating the configs
    this.renderComponent.$emit('widgetUpdate', this);
    return this;
  }
  /** Force re-rendering of render component*/
  repaint() {
    this.renderComponent.$set(this.renderComponent.render, 'key', new Date().getTime());
    this.renderComponent.$forceUpdate();
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
    if (triggers && triggers.length) {
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
    this.handleTriggers();
  }

  afterRender() {

  }

  beforeCreate(component) {
    // component.widget.applyConfig(component.config);
  }

  componentRender(component, createElement) {
    return createElement('el-input', this.getComponentConfig(), this.getChildren(createElement));
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
