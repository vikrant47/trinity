<template>
  <el-row :gutter="10">
    <el-col :span="18" />
    <el-col :span="6">
      <div class="list-operations">
        <el-input
          v-model="search"
          placeholder="Search"
          clearable
          suffix-icon="el-icon-search"
          style="width: 218px;"
          @keyup.enter="$emit('onSearch',search)"
          @keyup="$emit('onSearchKeyUp',search)"
        />
        <el-button-group class="crud-opts-right">
          <el-popover
            placement="bottom-end"
            width="150"
            trigger="click"
          >
            <el-button
              slot="reference"
              size="mini"
              icon="el-icon-s-grid"
            >
              <i
                class="fa fa-caret-down"
                aria-hidden="true"
              />
            </el-button>
            <el-checkbox
              v-model="allColumnsSelected"
              :indeterminate="listEventHandler.allColumnsSelectedIndeterminate"
              @change="handleCheckAllChange"
            >
              Select All
            </el-checkbox>
            <el-checkbox
              v-for="item in tableColumns"
              :key="item.field"
              v-model="item.visible"
              @change="listEventHandler.handleCheckedTableColumnsChange(item)"
            >
              {{ item.label }}
            </el-checkbox>
          </el-popover>
        </el-button-group>
      </div>
    </el-col>
  </el-row>

</template>

<script>
import CRUD from '@crud/crud';
import Vue from 'vue';

export default {
  name: 'EnListToolbar',
  props: {
    search: {
      type: String,
      default: ''
    },
    hiddenColumns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    ignoreColumns: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      listService: null,
      listEventHandler: null,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      tableUnwatcher: null,
      // Ignore the next table column change
      ignoreNextTableColumnsChange: false,
      tableColumns: []
    };
  }, watch: {
    'listService.definition.list.columns'() {
      this.tableColumns = this.listService.definition.list.columns;
    }
  },
  created() {
    const listService = this.$parent.listService;
    const listEventHandler = this.$parent.listEventHandler;
    Vue.set(this, 'listService', listService);
    Vue.set(this, 'listEventHandler', listEventHandler);
    // this.$parent.crud.updateProp('searchToggle', true);
  },
  methods: {
    handleCheckAllChange(val) {
      if (val === false) {
        this.allColumnsSelected = true;
        return;
      }
      this.allColumnsSelected = val;
      this.allColumnsSelectedIndeterminate = false;
    },
    handleCheckedTableColumnsChange(item) {
      let totalCount = 0;
      let selectedCount = 0;
      this.tableColumns.forEach(column => {
        ++totalCount;
        selectedCount += column.hidden ? 0 : 1;
      });
      if (selectedCount === 0) {
        this.crud.notify('Please select at least one column', CRUD.NOTIFICATION_TYPE.WARNING);
        this.$nextTick(function() {
          item.visible = true;
        });
        return;
      }
      this.allColumnsSelected = selectedCount === totalCount;
      this.allColumnsSelectedIndeterminate = selectedCount !== totalCount && selectedCount !== 0;
      this.updateColumnVisible(item);
    },
    updateColumnVisible(item) {
      const table = this.crud.props.table;
      const vm = table.$children.find(e => e.prop === item.property);
      const columnConfig = vm.columnConfig;
      if (item.hidden) {
        vm.owner.store.commit('removeColumn', columnConfig, null);
      } else {
        // Find a suitable insertion point
        const columnIndex = this.tableColumns.indexOf(item);
        vm.owner.store.commit('insertColumn', columnConfig, columnIndex + 1, null);
      }
      this.ignoreNextTableColumnsChange = true;
    },
    toggleSearch() {
      this.crud.props.searchToggle = !this.crud.props.searchToggle;
    }
  }
};
</script>

<style scoped>
.list-operations {
  float: right;
}
</style>
