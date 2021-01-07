import { RestQuery } from '@/modules/engine/services/rest.query';
import { AsyncEventObservable } from '@/modules/engine/core/engine.observable';
import $router from '@/router/routers';
import { Engine } from '@/modules/engine/core/engine';
import { ModelService } from '@/modules/engine/services/model.service';
import { FORM_EVENTS } from '@/modules/form/engine-api/form-events';
import * as _ from 'lodash';
import { EngineScript } from '@/modules/engine/core/engine.script';
import { FormWidgetService } from '@/modules/form/services/form.widget.service';
import { EngineAction } from '@/modules/engine/core/engine.action';
import { WIDGETS } from '@/modules/form/components/widgets/base-widget/widgets';

export class EngineForm extends AsyncEventObservable {
  $widgetRefs = {};
  processors = [];
  actions = [];
  hashCode = 0;
  loading = false;
  record = {};
  definition = { form: { config: { tabs: {}}}};
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

  static navigate(modelAlias, formId, context = 'create', recordId = 'new') {
    $router.replace('/models/' + modelAlias + '/form/' + formId + '/' + recordId + '?context = ' + context);
  }

  constructor(settings) {
    super();
    this.settings = Object.assign(this.settings, settings);
    if (this.settings.formConfig) {
      this.definition.form.config = this.settings.formConfig;
    }
    this.registerEvents();
  }

  /** Add widget instance ref in engine form*/
  addWidgetRef(widget) {
    this.$widgetRefs[widget.getFieldName()] = widget;
  }

  setRecord(record) {
    this.record = record;
  }

  getRecord() {
    return this.record;
  }

  enableLoading() {
    if (this.settings.showLoader === true) {
      this.loading = true;
    }
    return this;
  }

  disableLoading() {
    this.loading = false;
    return this;
  }

  registerEvents() {

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

  populateFormActions() {
    if (this.settings.remote === false) {
      this.actions = this.settings.actions;
    }
    const actions = this.definition.form.actions.map(action => new EngineAction(action));
    this.actions = Engine.convertToTree(actions, {
      comparator: (action1, action2) => action1.sort_order - action2.sort_order
    });
    return this;
  }

  populateFormProcessors() {
    if (this.settings.remote === false) {
      return this.settings.processors;
    }
    this.processors = this.definition.form.processors.map(processor => new EngineScript(processor));
    return this;
  }

  sanitizeDefinition() {
    Object.assign(this.formConfig, this.populateFormConfig());
    this.updateHash();
    this.populateFormActions();
    this.populateFormProcessors();
    return this.definition;
  }
  getFields() {
    return this.definition.fields;
  }
  getIncludeStatement(fields) {
    return fields.filter(field => field.type === WIDGETS.reference).map((field) => {
      return {
        reference: field.name,
        fields: [field.referenced_field_name, field.display_field_name],
      };
    });
  }
  async refresh() {
    try {
      await this.emit(FORM_EVENTS.model.beforeFetch);
      if (this.settings.remote === false || this.settings.recordId === 'new') {
        await this.emit(EngineForm.events.afterRefresh, this.record);
        return this.record;
      }
      this.enableLoading();
      // request record
      const response = await new RestQuery(this.settings.modelAlias).findById(this.settings.recordId, {
        include: this.getIncludeStatement(this.getFields()),
      });
      this.setRecord(response.contents);
      // time Show table in milliseconds
      setTimeout(async() => {
        this.disableLoading();
        this.emit(FORM_EVENTS.model.fetch, this.getRecord());
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
  getFieldsAsPallet() {
    return {
      title: 'Fields',
      updatable: true,
      list: this.definition.fields.map(field => new FormWidgetService().getWidgetInstance({
        id: field.id,
        widgetAlias: field.renderer,
        fieldName: field.name,
        immutable_configs: ['fieldName', 'referenced_model_alias', 'display_field_name', 'disabled'],
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
    for (const i in this.getFormData()) {
      if (updatableFields.indexOf(i) >= 0) {
        formatted[i] = this.record[i];
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

  /** Will return the widget instance*/
  getWidget(fieldName) {

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

  /**
   * @param {FormEvent} event
   * @param {Object} context
   **/
  async triggerProcessors(event, context = {}) {
    for (const processor of this.processors) {
      if (processor.event === event.getName()) {
        await processor.execute(event, Object.assign({ engineForm: this }, context));
      }
    }
  }
}
