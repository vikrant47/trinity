import Guid from '@/modules/list/components/widgets/guid';
import DateTime from '@/modules/list/components/widgets/datetime';
import Text from '@/modules/list/components/widgets/text';
import { ModelService } from '@/modules/engine/services/model.service';

export const COLUMN_FORMATTERS = {
  'guid': { widget: Guid, width: 250, sortable: false },
  'boolean': { widget: Text, width: 50, sortable: true },
  'integer': { widget: Guid, width: 100, sortable: true },
  'datetime': { widget: DateTime, width: 200, sortable: true },
  'text': { widget: Text, width: 250, sortable: false }
};

export class ListService {
  list;
  modelAlias;
  crud;
  definition = {
    list: {
      columns: {}
    }
  };

  constructor(definition) {
    this.definition = definition;
  }

  addFormatters() {
    this.definition.list.columns.forEach(column => {
      column.config = COLUMN_FORMATTERS[column.type] ? COLUMN_FORMATTERS[column.type] : COLUMN_FORMATTERS['text'];
    });
  }

  sanitizeDefinition() {
    this.addFormatters();
    return this.definition;
  }

  loadDefinition() {
    return new Promise((resolve, reject) => {
      crud.loading = true;
      // request data
      new ModelService(this.modelAlias).requestDefinition({
        list: this.list
      }).then(definition => {
        this.definition = definition;
        this.sanitizeDefinition();
        // time Show table in milliseconds
        setTimeout(() => {
          crud.loading = false;
        }, crud.time);
        resolve(definition);
      }).catch(err => {
        crud.loading = false;
        reject(err);
      });
    });
  }
}

/**
 * Definition
 */
export function definition() {
  return {
    props: {},
    data() {
      // Returning crud in data is to associate crud with the current instance, and the component observes changes in crud-related attributes
      return {
        crud: this.crud
      };
    },
    beforeCreate() {
      this.listRenderer = new ListService(this);
      this.listRenderer.loadDefinition();
    },
    created() {

    },
    destroyed() {

    },
    mounted() {

    }
  };
}

