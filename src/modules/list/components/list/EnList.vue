<template>
  <div class="list-container">
    <!--Toolbar-->
    <div class="head-container">
      <en-list-toolbar
        v-if="toolbar"
        :search-value="listService.quickSearchValue"
        :actions="listService.actions"
        @on-search="listService.search($event)"
      />
      <slot name="toolbar" />
    </div>
    <!-- <pre>{{ listService.definition.list.columns|json }}</pre>-->
    <!--Table rendering-->
    <div class="table-wrapper">
      <el-table
        ref="table"
        v-loading="listService.loading"
        resizable
        border
        stripe
        :data="listService.rows"
        highlight-current-row
        @selection-change="listEventHandler.selectionChangeHandler"
        @current-change="listEventHandler.handleCurrentChange($event)"
        @sort-change="listEventHandler.sortHandler($event)"
      >
        <el-table-column fixed type="selection" width="40" />
        <el-table-column
          v-for="column in listFields.filter(field=>field.visible)"
          :key="column.name"
          :prop="column.name"
          :label="column.label"
          :sortable="column.config.sortable && 'custom'"
          :width="column.config.width"
        >
          <template slot="header" slot-scope="scope">
            <div class="header-label">
              <span>{{ scope.column.label }}</span>
            </div>
            <slot name="header" />
          </template>
          <template #default="{row}">
            <div
              :is="column.config.widget"
              v-if="column.config.widget"
              :row="row"
              :column="column"
              :href="column.name==='id'"
              @click="cellClick($event,row,column)"
            />
          </template>
        </el-table-column>
        <el-scrollbar class="right-scrollbar">
          <slot name="body" />
        </el-scrollbar>
      </el-table>
    </div>
    <!--Paging component-->
    <div class="list-footer">
      <EnPagination :pagination-model="paginationModel" @refresh-click="listService.refresh()" />
    </div>
    <slot name="footer" />
  </div>
</template>

<script>
import EnListToolbar from '@/modules/list/components/toolbar/EnListToolbar';
import EnPagination from '@/modules/list/components/pagination/EnPagination';
import { EngineList } from '@/modules/list/engine-api/engine.list';
import { ListEventHandler } from '@/modules/list/services/list.event.handler';
import { Pagination } from '@/modules/list/models/pagination';
import { LIST_EVENTS, ListEvent } from '@/modules/list/engine-api/list-events';

export default {
  name: 'EnList',
  components: { EnListToolbar, EnPagination },
  mixins: [],
  props: {
    rows: {
      type: Array,
      default: null
    },
    modelAlias: {
      type: String,
      required: true
    },
    fields: {
      type: Array,
      default: () => {
        return [];
      }
    },
    pagination: {
      type: Object,
      default: null
    },
    remote: {
      type: Boolean,
      default: true
    },
    toolbar: {
      type: Boolean,
      default: true
    },
    selection: {
      type: String,
      default: 'multiple'
    },
    actions: {
      type: Array,
      default: null
    },
    list: {
      type: String,
      default: 'default'
    },
    showLoader: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      listFields: [],
      paginationModel: new Pagination(this.pagination),
      listService: new EngineList({
        pagination: this.paginationModel,
        remote: this.remote,
        showLoader: this.showLoader,
        loaderDelay: this.loaderDelay,
        modelAlias: this.modelAlias,
        list: this.list,
        fields: this.fields,
        rows: this.rows || [],
        actions: this.actions || []
      })
    };
  },
  beforeCreate() {
    this.listEventHandler = new ListEventHandler(this);
  },
  created() {
    this.listService.loadDefinition().then(() => {
      this.listFields = this.listService.getWidgets();
      this.listService.refresh();
    });
  },
  methods: {
    async cellClick($event, row, column) {
      const listEvent = new ListEvent(LIST_EVENTS.cell.click, this.listService);
      Object.assign(listEvent, { rowData: row, columnData: column });
      await this.listService.triggerProcessors(listEvent, {});
      this.$emit('cellClick', $event, row, column);
    },
    copy() {
      for (const key in this.currentRow) {
        this.form[key] = this.currentRow[key];
      }
      this.form.id = null;
      this.form.createTime = null;
      this.crud.toAdd();
    }
  }
};
</script>

<style scoped>

</style>
