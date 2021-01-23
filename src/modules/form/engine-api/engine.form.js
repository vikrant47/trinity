import { RestQuery } from '@/modules/engine/services/rest.query';
import $router from '@/router/routers';
import { Engine } from '@/modules/engine/core/engine';
import { ModelService } from '@/modules/engine/services/model.service';
import { FORM_EVENTS, FormEvent } from '@/modules/form/engine-api/form-events';
import * as _ from 'lodash';
import { FormWidgetService } from '@/modules/form/services/form.widget.service';
import { EngineDefinitionService } from '@/modules/engine/core/engine.definition.service';

export class EngineForm extends EngineDefinitionService {
  record = {};
  definition = { form: { config: { tabs: {}}}, fields: [] };
  formConfig = {
    widgets: [],
    labelSuffix: '',
    labelWidth: '100',
    labelPosition: 'right',
    formModel: 'formModel', // name of the for model key
    formRules: 'formRules' // name of the form rules key
  };
  settings = {
    recordId: 'new',
    showLoader: true,
    loaderDelay: 30
  };
  original = {};

  static navigate(modelAlias, formId = 'default', recordId = 'new', context = 'create') {
    $router.replace('/models/' + modelAlias + '/form/' + formId + '/' + recordId + '?context = ' + context);
  }

  constructor(settings) {
    super();
    this.settings = Object.assign(this.settings, settings);
    this.modelAlias = this.settings.modelAlias;
    if (this.settings.formConfig) {
      this.definition.form.config = this.settings.formConfig;
    }
    this.registerEvents();
  }

  setRecord(record) {
    this.original = Engine.clone(record);
    this.record = record;
  }

  getRecord() {
    return this.record;
  }

  getOriginal() {
    return this.original;
  }

  registerEvents() {

  }
  getSelectedFields() {
    return this.definition.form.config.widgets.filter((widget) => {
      return widget.fieldName;
    }).map((widget) => widget.fieldName);
  }
  populateFormConfig() {
    return { widgets: this.definition.form.config.widgets };
    /* const tabs = this.definition.form.config.tabs || [];
    const widgets = tabs.reduce((result, tab) => result.concat(tab.widgets), []);
    return { widgets };*/
  }

  updateHash() {
    this.hashCode = new Date().getTime();
  }

  populateFields() {
    this.fields = this.definition.fields;
  }

  populateActions() {
    this.actions = this.buildAction(this.definition.form.actions);
  }

  populateProcessors() {
    this.processors = this.buildProcessors(this.definition.form.processors);
  }

  sanitizeDefinition() {
    super.sanitizeDefinition();
    Object.assign(this.formConfig, this.populateFormConfig());
    this.updateHash();
    this.populateFields();
    this.populateActions();
    this.populateProcessors();
    return this.definition;
  }
  getFormDefinition() {
    return this.definition.form;
  }
  fillFieldConfig(fieldName, widgetConfig) {
    const field = this.getFieldByName(fieldName);
    if (field) {
      Object.assign(widgetConfig.fieldSettings, {
        readOnly: field.readonly,
        disabled: field.readonly,
      });
      switch (field.type) {
        case 'reference':
          // assigning default values
          Object.assign(widgetConfig.widgetSettings, {
            display_field_name: field.display_field_name,
            referenced_field_name: field.referenced_field_name,
            referenced_model_alias: field.referenced_model_alias
          });
          break;
        case 'enum':
          widgetConfig.slot.options = field.choices;
          break;
      }
    }
  }
  async loadData() {
    // request record
    await this.emit(FORM_EVENTS.model.beforeUpdate);
    const response = await new RestQuery(this.settings.modelAlias).findById(this.settings.recordId, {
      fields: this.getSelectedFields(),
      include: this.getIncludeStatement(this.getSelectedFields())
    });
    this.setRecord(response.contents);
    await this.emit(FORM_EVENTS.model.update);
    return this.record;
  }
  async refresh() {
    try {
      await this.emit(FORM_EVENTS.model.beforeFetch);
      if (this.settings.remote === false || this.settings.recordId === 'new') {
        await this.emit(FORM_EVENTS.model.fetch, this.record);
        return this.record;
      }
      this.enableLoading();
      await this.loadData();
      // time Show table in milliseconds
      setTimeout(async() => {
        this.disableLoading();
        this.emit(FORM_EVENTS.model.fetch, this.getRecord());
        this.triggerProcessors(new FormEvent(FORM_EVENTS.model.fetch, this), {});
      }, this.settings.loaderDelay);
    } catch (err) {
      this.disableLoading();
      this.emit(FORM_EVENTS.form.error, err);
      throw err;
    }
  }

  async loadDefinition() {
    try {
      await this.emit(FORM_EVENTS.definition.beforeFetch);
      if (this.settings.remote === false) {
        this.sanitizeDefinition();
      }
      this.enableLoading();
      // request data
      const response = await new ModelService(this.settings.modelAlias).requestDefinition({
        formId: this.settings.formId
      });
      this.definition = response.contents;
      this.sanitizeDefinition();
      // time Show table in milliseconds
      setTimeout(() => {
        this.disableLoading();
      }, this.settings.loaderDelay);
      this.emit(FORM_EVENTS.definition.fetch, this.definition);
    } catch (err) {
      this.disableLoading();
      this.emit(FORM_EVENTS.form.error, err);
      throw err;
    }
  }

  /** Return pallet for all the fields in form**/
  static getFieldsAsPallet(fields) {
    return {
      title: 'Fields',
      updatable: true,
      list: fields.map(field => new FormWidgetService().getWidgetInstance({
        id: field.id,
        widgetAlias: field.form_renderer,
        fieldName: field.name,
        immutable_configs: ['fieldName', 'referenced_model_alias', 'display_field_name', 'disabled', 'formModel'],
        widgetSettings: {
          label: field.label,
          referenced_model_alias: field.referenced_model_alias,
          display_field_name: field.display_field_name
        },
        palletSettings: {
          label: field.label
        }
      }))
    };
  }

  /** Returns all of the widgets from definition*/
  getFormConfig() {
    return this.formConfig;
  }

  setFormConfig(formConfig = {}) {
    this.definition.form.config = formConfig;
    this.formConfig = formConfig;
  }

  getWidgetConfig() {
    return this.formConfig.widgets;
  }

  setWidgetConfig(widgetConfig) {
    this.emit(FORM_EVENTS);
    this.formConfig.widgets = widgetConfig;
  }

  open() {

  }

  getFormattedRecord() {
    const updatableFields = this.definition.fields
      .filter(field => !field.readonly).map(field => field.name);
    const formatted = {};
    const formData = this.getFormData();
    for (const i in formData) {
      if (updatableFields.indexOf(i) >= 0) {
        formatted[i] = formData[i];
      }
    }
    return formatted;
  }

  /** Weather currently opened form is new */
  isNew() {
    return this.settings.recordId === 'new';
  }

  create() {
    return new RestQuery(this.settings.modelAlias).create(this.getFormattedRecord());
  }

  update() {
    return new RestQuery(this.settings.modelAlias).update(this.getFormattedRecord(), { where: { id: this.record.id }});
  }

  /** This will save the form record using api*/
  save() {
    if (this.isNew()) {
      return this.create();
    }
    return this.update();
  }

  /** Delete the current record*/
  delete() {

  }

  setFormData(formData) {
    Object.values(this.$widgetRefs).forEach((widget) => {
      widget.setValue(_.get(formData, widget.fieldName));
    });
  }

  getFormData() {
    const model = {};
    Object.values(this.$widgetRefs).forEach((widget) => {
      _.set(model, widget.fieldName, widget.getValue());
    });
    return model;
  }
  invoke(fieldName, method, args) {
    const widget = this.getWidgetRef(fieldName);
    return widget[method].apply(widget, args);
  }
  getValue(fieldName) {
    return this.invoke(fieldName, 'getValue');
  }

  setValue(fieldName, value) {
    return this.invoke(fieldName, 'setValue', [value]);
  }
  /**
   * @param {FormEvent} event
   * @param {Object} context
   **/
  async triggerProcessors(event, context = {}) {
    event.form = this;
    return super.triggerProcessors(event, context);
  }
}
