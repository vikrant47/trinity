import { EngineObservable } from '@/modules/engine/core/engine.observable';
import { ModelService } from '@/modules/engine/services/model.service';
import { RestQuery } from '@/modules/engine/services/rest.query';
import $router from '../../../router/routers';

export class FormService extends EngineObservable {
  static events = {
    beforeLoadDefinition: 'beforeLoadDefinition',
    afterLoadDefinition: 'afterLoadDefinition',
    beforeRefresh: 'beforeRefresh',
    afterRefresh: 'afterRefresh',
    error: 'error'
  };
  hashCode = 0;
  loading = false;
  record = {};
  definition = { form: { config: { tabs: {}}}};
  formConfig = { fields: [] };
  settings = {
    recordId: 'new',
    formConfig: {
      tabs: []
    },
    showLoader: true,
    loaderDelay: 30
  };

  static navigate(modelAlias, formId, context = 'create', recordId = 'new') {
    $router.replace('/models/' + modelAlias + '/form/' + formId + '/' + recordId + '?context = ' + context);
  }

  constructor(settings) {
    super();
    this.settings = Object.assign(this.settings, settings);
    this.definition.form.config = this.settings.formConfig;
    this.registerEvents();
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

  getFormConfig() {
    const tabs = this.definition.form.config.tabs || [];
    return { fields: tabs.reduce((result, tab) => result.concat(tab.fields), []) };
  }

  updateHash() {
    this.hashCode = new Date().getTime();
  }

  sanitizeDefinition() {
    Object.assign(this.formConfig, this.getFormConfig());
    this.updateHash();
    return this.definition;
  }

  refresh() {
    return new Promise((resolve, reject) => {
      this.emit(FormService.events.beforeRefresh);
      if (this.settings.remote === false || this.settings.recordId === 'new') {
        this.emit(FormService.events.afterRefresh, this.record);
        return this.record;
      }
      this.enableLoading();
      // request record
      new RestQuery(this.settings.modelAlias).findById(this.settings.recordId).then(result => {
        this.record = result.data;
        // time Show table in milliseconds
        setTimeout(() => {
          this.disableLoading();
          this.emit(FormService.events.afterRefresh, this.record);
        }, this.settings.loaderDelay);
        resolve(result);
      }).catch(err => {
        this.disableLoading();
        this.emit(FormService.events.error, err);
        reject(err);
      });
    });
  }

  loadDefinition() {
    return new Promise((resolve, reject) => {
      this.emit(FormService.events.beforeLoadDefinition);
      if (this.settings.remote === false) {
        this.sanitizeDefinition();
      }
      this.enableLoading();
      // request data
      new ModelService(this.settings.modelAlias).requestDefinition({
        formId: this.settings.formId
      }).then(definition => {
        this.definition = definition;
        this.sanitizeDefinition();
        // time Show table in milliseconds
        setTimeout(() => {
          this.disableLoading();
        }, this.settings.loaderDelay);
        resolve(definition);
        this.emit(FormService.events.afterRefresh, definition);
      }).catch(err => {
        this.disableLoading();
        this.emit(FormService.events.error, err);
        reject(err);
      });
    });
  }
}
