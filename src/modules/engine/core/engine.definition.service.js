import { EngineObservable } from '@/modules/engine/core/engine.observable';
import * as _ from 'lodash';
import { WIDGETS } from '@/modules/form/components/widgets/base-widget/widgets';
import { EngineAction } from '@/modules/engine/core/engine.action';
import { Engine } from '@/modules/engine/core/engine';
import { EngineScript } from '@/modules/engine/core/engine.script';

export class EngineDefinitionService extends EngineObservable {
  fields = {};
  processors = [];
  actions = [];
  definition = { fields: [] };
  $widgetRefs = {};
  modelAlias = null;
  loading = true;
  loadingBackground = 'rgb(255 255 255 / 55%)';
  definitionLoaded = false;

  getModelAlias() {
    return this.modelAlias;
  }

  /** Add widget instance ref in engine form*/
  addWidgetRef(widget) {
    this.$widgetRefs[widget.getFieldName()] = widget;
  }

  isDefinitionLoaded() {
    return this.definitionLoaded;
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

  updateHash() {
    this.hashCode = new Date().getTime();
  }

  populateFields() {
    this.fields = this.definition.fields;
  }

  sanitizeDefinition() {
    this.populateFields();
    return this.definition;
  }

  getFields() {
    return this.definition.fields;
  }

  getFieldNames() {
    return this.getFields().map(field => field.name);
  }

  getFieldsByKey(key) {
    return _.keyBy(this.getFields(), key);
  }

  getFieldsByType(type) {
    return this.getFields().filter(field => field.type === WIDGETS.reference);
  }

  getFieldByName(name) {
    return this.getFields().find(field => field.name === name);
  }

  /** Will return the widget instance*/
  getWidgetRef(fieldName) {
    return this.$widgetRefs[fieldName];
  }

  invokeWidget(fieldName, method, args = []) {
    const widget = this.$widgetRefs[fieldName];
    return widget[method].apply(widget, args);
  }

  getIncludeStatement(includedFields = []) {
    let referencedFields = this.getFieldsByType(WIDGETS.reference);
    if (includedFields.length > 0) {
      referencedFields = referencedFields.filter(field => includedFields.indexOf(field.name) >= 0);
    }
    return referencedFields.map((field) => {
      return {
        reference: field.name,
        fields: [field.referenced_field_name, field.display_field_name]
      };
    });
  }

  buildAction(actions) {
    let actionInstances = actions.map(action => {
      if (typeof action.style === 'string') {
        action.style = JSON.parse(action.style);
      }
      if (Array.isArray(action.style)) {
        action.style = action.style[0];
      }
      return new EngineAction(action);
    });
    actionInstances = Engine.convertToTree(actionInstances, {
      comparator: (action1, action2) => action1.sort_order - action2.sort_order,
      parentField: 'parent_id',
    });
    return actionInstances;
  }

  buildProcessors(processors) {
    return processors.map(processor => new EngineScript(processor));
  }

  /**
   * @param {FormEvent|ListEvent} event
   * @param {Object} context
   **/
  async triggerProcessors(event, context = {}) {
    for (const processor of this.processors) {
      if (processor.events && processor.events.indexOf(event.getName()) >= 0) {
        await processor.execute(event, context);
      }
    }
  }
}
