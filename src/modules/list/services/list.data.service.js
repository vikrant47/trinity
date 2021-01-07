import { RestQuery } from '@/modules/engine/services/rest.query';
import { EngineObservable } from '@/modules/engine/core/engine.observable';
import { ModelService } from '@/modules/engine/services/model.service';
import Guid from '@/modules/list/components/widgets/guid';
import Integer from '@/modules/list/components/widgets/integer';
import Text from '@/modules/list/components/widgets/text';
import DateTime from '@/modules/list/components/widgets/datetime';
import { Pagination } from '@/modules/list/models/pagination';
import * as _ from 'lodash';
import { SearchDataService } from '@/modules/list/services/search.data.service';
import { Engine } from '@/modules/engine/core/engine';
import { EngineAction } from '@/modules/engine/core/engine.action';

export const COLUMN_FORMATTERS = {
  'guid': { widget: Guid, width: 250, sortable: false },
  'boolean': { widget: Text, width: 30, sortable: true },
  'number': { widget: Integer, width: 250, sortable: true },
  'integer': { widget: Integer, width: 80, sortable: true },
  'datetime': { widget: DateTime, width: 175, sortable: true },
  'text': { widget: Text, width: 175, sortable: false }
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
  actions = [];
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

  populateListActions() {
    if (this.settings.remote === false) {
      return this.settings.actions;
    }
    const listActions = this.definition.list.actions.map(action => new EngineAction(action));
    this.actions = Engine.convertToTree(listActions, {
      comparator: (action1, action2) => action1.sort_order - action2.sort_order
    });
    return this;
  }

  /** *{$or:[{}]}*/
  buildQuickSearchCondition() {
    const conditions = [];
    if (this.quickSearchValue && this.quickSearchValue.trim().length > 0) {
      const sds = new SearchDataService();
      const quickSearch = sds.getQuickSearchOperatorByValue(this.quickSearchValue);
      if (this.definition.list) {
        let searchableColumns = 0;
        this.definition.list.columns.forEach((column) => {
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
    this.emit(ListDataService.events.beforeRefresh);
    if (this.settings.remote === false) {
      this.emit(ListDataService.events.afterRefresh, this.rows);
      return this.rows;
    }
    this.enableLoading();
    try {
      // request rows
      const response = await new RestQuery(this.settings.modelAlias).paginate({
        // attributes: this.getColumnNames(),
        page: this.pagination.page,
        limit: this.pagination.limit,
        where: this.getQuery(),
        order: [{ attribute: this.order.attribute, direction: this.order.direction }]
      });
      this.pagination.total = response.contents.total;
      this.rows = response.contents.data;
      // time Show table in milliseconds
      setTimeout(() => {
        this.disableLoading();
        this.emit(ListDataService.events.afterRefresh, this.rows);
      }, this.settings.loaderDelay);
    } catch (err) {
      this.disableLoading();
      this.emit(ListDataService.events.error, err);
      throw err;
    }
  }

  getColumnNames() {
    return this.definition.list.columns.filter(column => column.field.indexOf('[') < 0).map(column => column.field);
  }

  /** Adding formatters for columns**/
  addColumnFormatters() {
    this.definition.list.columns.forEach(column => {
      column.visible = !column.hidden;
      const columnsType = (column.type || '').replace('/', '');
      column.config = COLUMN_FORMATTERS[columnsType] ? COLUMN_FORMATTERS[columnsType] : COLUMN_FORMATTERS['text'];
    });
  }

  sanitizeDefinition() {
    this.addColumnFormatters();
    this.populateListActions();
    return this.definition;
  }

  async loadDefinition() {
    try {
      this.emit(ListDataService.events.beforeLoadDefinition);
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
      this.emit(ListDataService.events.afterRefresh, this.definition);
      return this.definition;
    } catch (err) {
      this.disableLoading();
      this.emit(ListDataService.events.error, err);
      throw err;
    }
  }
}
