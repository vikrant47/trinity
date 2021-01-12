import { RestQuery } from '@/modules/engine/services/rest.query';
import { ModelService } from '@/modules/engine/services/model.service';
import { Pagination } from '@/modules/list/models/pagination';
import * as _ from 'lodash';
import { SearchDataService } from '@/modules/list/services/search.data.service';
import { Engine } from '@/modules/engine/core/engine';
import { LIST_EVENTS } from '@/modules/list/engine-api/list-events';
import { EngineDefinitionService } from '@/modules/engine/core/engine.definition.service';
import { LIST_WIDGETS } from '@/modules/list/components/widgets/base/list.widgets';

export class EngineList extends EngineDefinitionService {
  definition = {
    list: {
      fields: []
    }
  };
  columns = [];
  rows = [];
  order = {
    attribute: 'updated_at',
    direction: 'ASC'
  };
  pagination = {
    // page number
    page: 0,
    // Number of rows per page
    limit: 15,
    // Total number of rows
    total: 0
  };
  settings = {
    list: 'default',
    modelAlias: null,
    remote: true,
    showLoader: true,
    loaderDelay: 30
  };
  condition = {};
  quickSearchValue = null;

  constructor(settings) {
    super();
    this.settings = Object.assign(this.settings, settings);
    this.rows = this.settings.rows;
    this.definition.list.config = { widgets: this.settings.columns };
    this.pagination = this.settings.pagination || new Pagination();
    this.registerEvents();
  }

  registerEvents() {
    this.pagination.on([Pagination.events.sizeChange, Pagination.events.currentChange], () => {
      this.refresh();
    });
  }

  populateActions() {
    this.actions = this.buildAction(this.definition.list.actions);
  }

  populateProcessors() {
    this.processors = this.buildProcessors(this.definition.list.processors);
  }

  /** *{$or:[{}]}*/
  buildQuickSearchCondition() {
    const conditions = [];
    if (this.quickSearchValue && this.quickSearchValue.trim().length > 0) {
      const sds = new SearchDataService();
      const quickSearch = sds.getQuickSearchOperatorByValue(this.quickSearchValue);
      if (this.definition.list) {
        let searchableColumns = 0;
        this.getWidgets().forEach((column) => {
          if (column.searchable) {
            searchableColumns = searchableColumns + 1;
            if (!quickSearch.supportedTypes || quickSearch.supportedTypes.indexOf(column.type) > -1) {
              if (quickSearch.op) {
                conditions.push({ [column.field]: { [quickSearch.op]: quickSearch.value }});
              } else {
                conditions.push({ [column.field]: quickSearch.value });
              }
            }
          }
        });
        if (searchableColumns > 0 && conditions.length === 0) {
          Engine.notify(this.vm, {
            type: 'info',
            message: 'No column qualified for given search'
          });
        }
      }

      if (conditions.length > 0) {
        return { '$or': conditions };
      }
    }
    return null;
  }

  getQuery() {
    const qsCondition = this.buildQuickSearchCondition();
    if (qsCondition) {
      if (!_.isEmpty(this.condition)) {
        return {
          '$and': [
            this.condition,
            qsCondition
          ]
        };
      }
      return qsCondition;
    }
    return this.condition;
  }

  search(value) {
    this.quickSearchValue = value;
    return this.refresh();
  }

  async refresh() {
    this.emit(LIST_EVENTS.model.beforeFetch);
    if (this.settings.remote === false) {
      this.emit(LIST_EVENTS.model.fetch, this.rows);
      return this.rows;
    }
    this.enableLoading();
    try {
      // request rows
      const response = await new RestQuery(this.settings.modelAlias).paginate({
        fields: this.getFieldNames(),
        page: this.pagination.page,
        limit: this.pagination.limit,
        where: this.getQuery(),
        include: this.getIncludeStatement(),
        order: [{
          field: this.order.attribute,
          direction: this.order.direction,
        }]
      });
      this.pagination.total = response.contents.total;
      this.rows = response.contents.data;
      // time Show table in milliseconds
      setTimeout(() => {
        this.disableLoading();
        this.emit(LIST_EVENTS.model.fetch, this.rows);
      }, this.settings.loaderDelay);
    } catch (err) {
      this.disableLoading();
      this.emit(LIST_EVENTS.list.error, err);
      throw err;
    }
  }

  getColumnNames() {
    return this.definition.list.fields.filter(column => column.field.indexOf('[') < 0).map(column => column.field);
  }

  /** Adding formatters for columns**/
  addColumnFormatters() {
    if (this.definition.list.config.widgets) {
      const configFields = this.definition.list.config.widgets;
      const fieldsWithId = this.getFieldsByKey('id');
      this.definition.list.config.widgets = configFields.map(field => {
        field = Object.assign({}, fieldsWithId[field.id], field);
        field.visible = !field.hidden;
        field.config = LIST_WIDGETS[field.list_renderer] || LIST_WIDGETS['input'];
        return field;
      });
    }
    return this.definition.list.config.widgets;
  }

  getWidgets() {
    return this.definition.list.config.widgets || [];
  }

  sanitizeDefinition() {
    super.sanitizeDefinition();
    this.addColumnFormatters();
    this.populateActions();
    this.populateProcessors();
    return this.definition;
  }

  async loadDefinition() {
    try {
      this.emit(LIST_EVENTS.definition.beforeLoadDefinition);
      if (this.settings.remote === false) {
        this.sanitizeDefinition();
      }
      this.enableLoading();
      // request data
      const response = await new ModelService(this.settings.modelAlias).requestDefinition({
        list: this.settings.list === 'default' ? 'default' : atob(this.settings.list)
      });
      this.definition = response.contents;
      this.sanitizeDefinition();
      // time Show table in milliseconds
      setTimeout(() => {
        this.disableLoading();
      }, this.settings.loaderDelay);
      this.emit(LIST_EVENTS.definition.fetch, this.definition);
      return this.definition;
    } catch (err) {
      this.disableLoading();
      this.emit(LIST_EVENTS.list.error, err);
      throw err;
    }
  }

  triggerProcessors(event, context = {}) {
    event.list = this;
    return super.triggerProcessors(event, context);
  }
}
