<template>
  <div class="app-container">
    <!--Toolbar-->
    <div class="head-container">
      <div v-if="">
        <!-- search -->
        <el-input
          v-model="query.name"
          clearable
          placeholder="Enter name search"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <rrOperation />
      </div>
      <en-list-toolbar />
    </div>
    <!--Table rendering-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      highlight-current-row
      style="width: 100%"
      @selection-change="crud.selectionChangeHandler"
      @current-change="handleCurrentChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column v-for="column in crud.definition.columns" :prop="column.field" :label="column.label" />
      <el-table-column prop="port" label="The port number" />
      <el-table-column prop="uploadPath" label="Upload catalog" />
      <el-table-column prop="deployPath" label="Deployment directory" />
      <el-table-column prop="backupPath" label="Backup directory" />
      <el-table-column prop="createTime" label="Creation date">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-permission="['admin','app:edit','app:del']" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--Paging component-->
    <pagination />
  </div>
</template>

<script>
import crudApp from '@/api/mnt/app';
import CRUD, { presenter, header, form, crud, definition } from '@crud/crud';
import rrOperation from '@crud/RR.operation';
import udOperation from '@crud/UD.operation';
import pagination from '@crud/Pagination';
import DateRangePicker from '@/components/DateRangePicker';
import EnListToolbar from '@/modules/list/components/toolbar/EnListToolbar';

const defaultForm = {
  id: null,
  name: null,
  port: 8080,
  uploadPath: '/opt/upload',
  deployPath: '/opt/app',
  backupPath: '/opt/backup',
  startScript: null,
  deployScript: null
};
export default {
  name: 'App',
  components: { EnListToolbar, pagination, rrOperation, udOperation, DateRangePicker },
  cruds() {
    return CRUD({ title: 'Application', url: '/api/engine/models/queue', crudMethod: { ...crudApp }});
  },
  mixins: [definition(), presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      currentRow: null
    };
  },
  methods: {
    copy() {
      for (const key in this.currentRow) {
        this.form[key] = this.currentRow[key];
      }
      this.form.id = null;
      this.form.createTime = null;
      this.crud.toAdd();
    },
    handleCurrentChange(row) {
      this.currentRow = JSON.parse(JSON.stringify(row));
    }
  }
};
</script>

<style scoped>
</style>
