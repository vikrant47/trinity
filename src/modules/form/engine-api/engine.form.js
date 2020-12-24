import { RestQuery } from '@/modules/engine/services/rest.query';
import { AsyncEventObservable } from '@/modules/engine/core/engine.observable';
import $router from '@/router/routers';
import { Engine } from '@/modules/engine/core/engine';
import { ModelService } from '@/modules/engine/services/model.service';
import { FORM_EVENTS } from '@/modules/form/engine-api/form-events';
import * as _ from 'lodash';

export class EngineForm extends AsyncEventObservable {
  $widgetRefs = {};
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
    const tabs = this.definition.form.config.tabs || [];
    const widgets = tabs.reduce((result, tab) => result.concat(tab.widgets), []);
    return { widgets };
  }

  updateHash() {
    this.hashCode = new Date().getTime();
  }

  populateFormActions() {
    if (this.settings.remote === false) {
      return this.settings.actions;
    }
    const actions = this.definition.form.actions;
    this.actions = Engine.convertToTree(actions, {
      comparator: (action1, action2) => action1.sort_order - action2.sort_order
    });
    return this;
  }

  sanitizeDefinition() {
    Object.assign(this.formConfig, this.populateFormConfig());
    this.updateHash();
    this.populateFormActions();
    return this.definition;
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
      const record = await new RestQuery(this.settings.modelAlias).findById(this.settings.recordId);
      this.setRecord(record);
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
      const definition = await new ModelService(this.settings.modelAlias).requestDefinition({
        formId: this.settings.formId
      });
      this.definition = definition;
      this.sanitizeDefinition();
      // time Show table in milliseconds
      setTimeout(() => {
        this.disableLoading();
      }, this.settings.loaderDelay);
      this.emit(FORM_EVENTS.definition.fetch, definition);
    } catch (err) {
      this.disableLoading();
      this.emit(FORM_EVENTS.form.error, err);
      throw err;
    }
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

  /** Weather currently opened form is new */
  isNew() {
    return this.settings.recordId === 'new';
  }

  create() {
    return new RestQuery(this.settings.modelAlias).create(this.record);
  }

  update() {
    return new RestQuery(this.settings.modelAlias).update(this.record, { where: { id: this.record.id }});
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
}
