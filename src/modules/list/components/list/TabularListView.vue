<template>
  <div class="table-wrapper" :v-if="engineList">
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

</template>

<script>
import { EngineList } from '@/modules/list/engine-api/engine.list';
import EnPagination from '@/modules/list/components/pagination/EnPagination';
import { ListEventHandler } from '@/modules/list/services/list.event.handler';

export default {
  name: 'TabularListView',
  components: { EnPagination },
  props: {
    listFields: {
      type: Array,
      required: true
    },
    engineList: {
      type: EngineList,
      required: true
    },
    listEventHandler: {
      type: ListEventHandler,
      required: true
    }
  },
  mounted() {
    this.engineList.refresh().then(() => {
      // Vue.set(this, 'engineList', engineList);
    });
  },
  methods: {
    cellClick($event, row, column) {
      this.$emit('cellClick', $event, row, column);
    }
  }
};
</script>

<style scoped>

</style>
