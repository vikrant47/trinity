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
import { EngineScript } from '@/modules/engine/core/engine.script';

export class BaseWidget extends EngineObservable {
  static defaultPalletSettings = {
    label: 'Input',
    icon: 'input',
    hidden: false
  };
  static defaultWidgetSettings = {
    referenced_field_name: 'id',
    span: 12,
    label: null,
    formId: null,
    layout: ITEM_LAYOUT.colFormItem,
    regList: [],
    tagIcon: 'date',
    document: null,
    required: false,
    changeTag: true,
    renderKey: null,
    showLabel: true,
    labelWidth: 150,
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
    triggers: [],
    wrapper: true
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
    multiple: false,
    size: 'medium'
  };
  designMode = false;
  transient = [
    'oldValueHash',
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
  oldValueHash = null;
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
  previewMode = false;
  static debouncedCallbacks = {
    valueChanged: _.debounce((renderComponent, value) => {
      renderComponent.$emit('input_update', value);
    }, 500)
  };
  immutable_configs = ['formModel'];

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

  init() {
  }

  getForm() {
    return this.engineForm;
  }

  setForm(engineForm) {
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

  syncConfig(property) {
    this.renderComponent.$emit('syncConfig', property, this);
  }

  setValue(value, repaint = true) {
    const hash = Engine.generateHash(value);
    if (typeof value !== 'undefined' && this.fieldName && this.renderComponent && this.oldValueHash !== hash) {
      if (this.fieldName.indexOf('.') > 0) {
        const result = TemplateEngine.walk(this.fieldName, this.renderComponent.formModel, -1);
        this.renderComponent.$set(result.value, result.prop, value);
      }
      this.renderComponent.$set(this.renderComponent.formModel, this.fieldName, value);
      if (repaint) {
        this.repaint();
      }
      this.renderComponent.$emit('input', value);
      BaseWidget.debouncedCallbacks.valueChanged(this.renderComponent, value);
      this.oldValueHash = hash;
    }
    return this;
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
    const FormWidgetService = require('../../../services/form.widget.service').FormWidgetService;
    return new FormWidgetService().getWidgetInstance(marshalledWidget);
  }

  overrideConfigSection(configSectionWidgets) {
    return configSectionWidgets;
  }

  loadBasicConfigSection() {
    this.loadConfigForConfigSection();
    return { widgets: this.configSection.widgets.filter((widget) => !widget.widgetSettings.advance) };
  }

  loadAdvanceConfigSection() {
    this.loadConfigForConfigSection();
    return { widgets: this.configSection.widgets.filter((widget) => widget.widgetSettings.advance) };
  }

  loadConfigForConfigSection() {
    if (this.configSection.widgets.length === 0) {
      const configSectionWidgets = this.overrideConfigSection(Engine.clone(DEFAULT_CONFIG_SECTION));
      this.configSection.widgets = Object.keys(configSectionWidgets)
        .filter(key => this.immutable_configs.indexOf(key) < 0)
        .map(fieldName => {
          const marshalledWidget = configSectionWidgets[fieldName];
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
    let labelWidth = typeof this.widgetSettings.labelWidth !== 'undefined' ? this.widgetSettings.labelWidth : BaseWidget.defaultWidgetSettings.labelWidth;
    if (this.widgetSettings.showLabel === false) labelWidth = '0';
    Object.assign(this.formItemConfig, {
      attrs: {
        labelWidth: labelWidth ? `${labelWidth}px` : null,
        prop: this.fieldName,
        label: this.widgetSettings.showLabel ? this.widgetSettings.label : '',
        required: this.widgetSettings.required
      }
    });
    return this.formItemConfig;
  }

  unmarshall(source, unmarshall) {
    if (source.fieldSettings) {
      if (!source.fieldSettings.placeholder) {
        source.fieldSettings.placeholder = 'Please Enter ' + (source.widgetSettings.label ? source.widgetSettings.label : 'Value');
      }
    }
    if (source.widgetSettings) {
      if (!source.widgetSettings.label) {
        source.widgetSettings.label = this.palletSettings.label;
      }
    }
    return false;
  }

  getComponentConfig() {
    let widgetSettings = Engine.clone(this.widgetSettings, true);
    let fieldSettings = Engine.clone(this.fieldSettings, true);
    fieldSettings = this.overrideFieldSettings(fieldSettings) || fieldSettings;
    widgetSettings = this.overrideWidgetSettings(widgetSettings) || widgetSettings;
    fieldSettings.name = this.fieldName;
    // this.fieldSettings['value'] = this.formModel[this.fieldName];
    // this.fieldSettings['v-model'] = this.fieldName;
    fieldSettings.value = _.get(this.formModel, this.fieldName);
    if (typeof fieldSettings.value === 'undefined') {
      fieldSettings.value = widgetSettings.defaultValue;
    }
    Object.assign(this.componentConfig, { attrs: fieldSettings, on: {}}, widgetSettings);
    this.componentConfig.on.input = val => {
      // this.getMethods(); // TODO: remove this - just reference for debugging
      // this.renderComponent.$emit('input', val);
      if (typeof val !== 'undefined') {
        this.setValue(val);
      }
    };
    Object.assign(this.componentConfig.on, this.getEvents(this.componentConfig));
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
    return EngineScript.buildContext(Object.assign({}, this.evalContext, {
      widget: this
    }), this);
  }

  handleTriggers() {
    if (!this.designMode) {
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

  setPreviewMode(previewMode) {
    this.previewMode = previewMode;
  }

  previewView(component, h) {
    const value = this.getValue();
    return h('div', { class: 'field-preview' }, [(typeof value === 'undefined' || value === null) ? 'None' : value]);
  }

  componentRender(component, h) {
    return h('el-input', this.getComponentConfig(), this.getChildren(h));
  }

  renderWidget(component, h) {
    if (this.previewMode) {
      return this.previewView(component, h);
    }
    return this.componentRender(component, h);
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
