import { RestQuery } from '@/modules/engine/services/rest.query';
import { EngineObservable } from '@/modules/engine/core/engine.observable';
import { ModelService } from '@/modules/engine/services/model.service';
import Guid from '@/modules/list/components/widgets/guid';
import Text from '@/modules/list/components/widgets/text';
import DateTime from '@/modules/list/components/widgets/datetime';
import { Pagination } from '@/modules/list/models/pagination';
import * as _ from 'lodash';

export const COLUMN_FORMATTERS = {
  'guid': { widget: Guid, width: 250, sortable: false },
  'boolean': { widget: Text, width: 50, sortable: true },
  'integer': { widget: Guid, width: 100, sortable: true },
  'datetime': { widget: DateTime, width: 200, sortable: true },
  'text': { widget: Text, width: 250, sortable: false }
};

export class ListDataService extends EngineObservable {
  static events = {
    beforeRefresh: 'beforeRefresh',
    afterRefresh: 'afterRefresh',
    error: 'error'
  };
  definition = {
    list: {
      columns: []
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
  loading = false;
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
    this.definition.list.columns = this.settings.columns;
    this.pagination = this.settings.pagination || new Pagination();
    this.registerEvents();
  }

  registerEvents() {
    this.pagination.on([Pagination.events.sizeChange, Pagination.events.currentChange], () => {
      this.refresh();
    });
  }

  get columns() {
    return this.definition.list.columns;
  }

  set columns(value) {
    this.definition.list.columns = value;
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

  /** *{$or:[{}]}*/
  buildQuickSearchCondition() {
    const conditions = [];
    if (this.definition.list) {
      this.definition.list.columns.forEach((column) => {
        if (column.searchable) {
          conditions.push({ [column.field]: this.quickSearchValue });
        }
      });
    }
    if (conditions.length > 0) {
      return { '$or': conditions };
    }
    return null;
  }

  getQuery() {
    if (this.quickSearchValue && this.quickSearchValue.trim().length > 0) {
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
    }
    return this.condition;
  }

  search(value) {
    this.quickSearchValue = value;
    return this.refresh();
  }

  refresh() {
    return new Promise((resolve, reject) => {
      this.emit(ListDataService.events.beforeRefresh);
      if (this.settings.remote === false) {
        this.emit(ListDataService.events.afterRefresh, this.rows);
        return this.rows;
      }
      this.enableLoading();
      // request rows
      new RestQuery(this.settings.modelAlias).paginate({
        // attributes: this.getColumnNames(),
        page: this.pagination.page,
        limit: this.pagination.limit,
        where: this.getQuery(),
        order: [{ attribute: this.order.attribute, direction: this.order.direction }]
      }).then(result => {
        this.pagination.total = result.total;
        this.rows = result.data;
        // time Show table in milliseconds
        setTimeout(() => {
          this.disableLoading();
          this.emit(ListDataService.events.afterRefresh, this.rows);
        }, this.settings.loaderDelay);
        resolve(result);
      }).catch(err => {
        this.disableLoading();
        this.emit(ListDataService.events.error, err);
        reject(err);
      });
    });
  }

  getColumnNames() {
    return this.definition.list.columns.filter(column => column.field.indexOf('[') < 0).map(column => column.field);
  }

  /** Adding formatters for columns**/
  addColumnFormatters() {
    this.definition.list.columns.forEach(column => {
      column.visible = !column.hidden;
      column.config = COLUMN_FORMATTERS[column.type] ? COLUMN_FORMATTERS[column.type] : COLUMN_FORMATTERS['text'];
    });
  }

  sanitizeDefinition() {
    this.addColumnFormatters();
    return this.definition;
  }

  loadDefinition() {
    return new Promise((resolve, reject) => {
      this.emit(ListDataService.events.beforeLoadDefinition);
      if (this.settings.remote === false) {
        this.sanitizeDefinition();
      }
      this.enableLoading();
      // request data
      new ModelService(this.settings.modelAlias).requestDefinition({
        list: this.settings.list === 'default' ? 'default' : atob(this.settings.list)
      }).then(definition => {
        this.definition = definition;
        this.sanitizeDefinition();
        // time Show table in milliseconds
        setTimeout(() => {
          this.disableLoading();
        }, this.settings.loaderDelay);
        resolve(definition);
        this.emit(ListDataService.events.afterRefresh, definition);
      }).catch(err => {
        this.disableLoading();
        this.emit(ListDataService.events.error, err);
        reject(err);
      });
    });
  }
}
