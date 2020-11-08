<template>
  <div class="list-container">
    <!--Toolbar-->
    <div class="head-container">
      <en-list-toolbar v-if="toolbar" />
      <slot name="toolbar" />
    </div>
    <!--Table rendering-->
    <div class="table-wrapper">
      <el-table
        v-if="listService"
        ref="table"
        v-loading="listService.loading"
        resizable
        border
        height="480"
        stripe
        :data="listService.rows"
        highlight-current-row
        style="width: 100%"
        @selection-change="listEventHandler.selectionChangeHandler"
        @current-change="listEventHandler.handleCurrentChange"
        @sort-change="listEventHandler.sortHandler"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="column in listService.definition.list.columns"
          :key="column.field"
          fixed
          :prop="column.field"
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
            />
          </template>
        </el-table-column>
        <slot name="body" />
      </el-table>
    </div>
    <!--Paging component-->
    <div class="pagination-wrapper">
      <EnPagination v-if="paginationModel" :pagination-model="paginationModel" />
    </div>
    <slot name="footer" />
  </div>
</template>

<script>
import Vue from 'vue';
import EnListToolbar from '@/modules/list/components/toolbar/EnListToolbar';
import EnPagination from '@/modules/list/components/pagination/EnPagination';
import { ListDataService } from '@/modules/list/services/list.data.service';
import { ListEventHandler } from '@/modules/list/services/list.event.handler';
import { Pagination } from '@/modules/list/models/pagination';

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
    columns: {
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
    list: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {
      paginationModel: null,
      listService: null,
    };
  },
  beforeCreate() {
    this.listEventHandler = new ListEventHandler(this);
  },
  created() {
    const paginationModel = new Pagination(this.pagination);
    const listService = new ListDataService({
      pagination: paginationModel,
      remote: this.remote,
      showLoader: this.showLoader,
      loaderDelay: this.loaderDelay,
      modelAlias: this.modelAlias,
      list: this.list,
      columns: this.columns,
      rows: this.rows || []
    });
    listService.loadDefinition().then(() => {
      listService.refresh();
    });
    Vue.set(this, 'listService', listService);
    Vue.set(this, 'paginationModel', paginationModel);
  },
  methods: {
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
