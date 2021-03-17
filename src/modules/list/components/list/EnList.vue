<template>
  <div class="list-container">
    <!--Toolbar-->
    <div class="head-container">
      <en-list-toolbar
        v-if="toolbar"
        :engine-list="engineList"
        :search-value="engineList.quickSearchValue"
        :actions="engineList.actions"
        @on-search="engineList.search($event)"
      />
      <slot name="toolbar" />
    </div>
    <!-- <pre>{{ engineList.definition.list.columns|json }}</pre>-->
    <!--Table rendering-->
    <div class="table-wrapper">
      <el-table
        ref="table"
        v-loading="engineList.loading"
        element-loading-background="engineList.loadingBackground"
        resizable
        border
        stripe
        height="height"
        :data="engineList.rows"
        highlight-current-row
        @selection-change="listEventHandler.selectionChangeHandler($event)"
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
          :min-width="column.config.minWidth"
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
      <EnPagination :pagination-model="engineList.pagination" @refresh-click="engineList.refresh()" />
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
    lazy: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 460
    },
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
      engineList: new EngineList({
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
  mounted() {
    this.$emit('mounted', this.engineList);
  },
  beforeCreate() {
    this.listEventHandler = new ListEventHandler(this);
    this.$emit('beforeCreate', this.engineList);
  },
  created() {
    this.$emit('created', this.engineList);
    if (!this.lazy) {
      this.loadList();
    }
    // Vue.set(this, 'engineList', engineList);
  },
  methods: {
    loadList() {
      this.engineList.loadDefinition().then(() => {
        this.listFields = this.engineList.getWidgets();
        this.engineList.refresh().then(() => {
          // Vue.set(this, 'engineList', engineList);
        });
      });
    },
    async cellClick($event, row, column) {
      const listEvent = new ListEvent(LIST_EVENTS.cell.click, this.engineList);
      Object.assign(listEvent, { rowData: row, columnData: column });
      await this.engineList.triggerProcessors(listEvent, {});
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
