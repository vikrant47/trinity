<template>
  <div class="list-container">
    <!--Toolbar-->
    <div class="head-container">
      <en-list-toolbar
        v-if="toolbar"
        :search-value="listService.quickSearchValue"
        :actions="listService.listActions"
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
        height="460"
        stripe
        :data="listService.rows"
        highlight-current-row
        @selection-change="listEventHandler.selectionChangeHandler"
        @current-change="listEventHandler.handleCurrentChange($event)"
        @sort-change="listEventHandler.sortHandler($event)"
      >
        <el-table-column type="selection" width="30" />
        <el-table-column
          v-for="column in listService.definition.list.columns.filter(col=>col.visible)"
          :key="column.field"
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
              :href="column.field==='id'"
              @click="$emit('cellClick',$event,row,column)"
            />
          </template>
        </el-table-column>
        <slot name="body" />
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
      paginationModel: null,
      listService: null
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
      rows: this.rows || [],
      actions: this.actions || []
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
