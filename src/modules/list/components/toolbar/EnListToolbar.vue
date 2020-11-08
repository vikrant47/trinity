<template>
  <el-row :gutter="10">
    <el-col :span="18" />
    <el-col :span="6">
      <div class="crud-opts">
        <el-input v-model="search" placeholder="Search" clearable suffix-icon="el-icon-search" style="width: 218px;" />
        <el-button-group class="crud-opts-right">
          <el-button
            size="mini"
            icon="el-icon-refresh"
            @click="crud.refresh()"
          />
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
              :indeterminate="allColumnsSelectedIndeterminate"
              @change="handleCheckAllChange"
            >
              Select All
            </el-checkbox>
            <el-checkbox
              v-for="item in tableColumns"
              :key="item.property"
              v-model="item.visible"
              @change="handleCheckedTableColumnsChange(item)"
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
      crud: {},
      tableColumns: [],
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      tableUnwatcher: null,
      // Ignore the next table column change
      ignoreNextTableColumnsChange: false
    };
  },
  watch: {
    'data.crud.props.table'() {
      this.updateTableColumns();
      this.tableColumns.forEach(column => {
        if (this.hiddenColumns.indexOf(column.property) !== -1) {
          column.visible = false;
          this.updateColumnVisible(column);
        }
      });
    },
    'data.crud.props.table.store.states.columns'() {
      this.updateTableColumns();
    }
  },
  created() {
    this.crud = this.$parent.crud;
    // this.$parent.crud.updateProp('searchToggle', true);
  },
  methods: {
    handleCheckAllChange(val) {
      if (val === false) {
        this.allColumnsSelected = true;
        return;
      }
      this.tableColumns.forEach(column => {
        if (!column.visible) {
          column.visible = true;
          this.updateColumnVisible(column);
        }
      });
      this.allColumnsSelected = val;
      this.allColumnsSelectedIndeterminate = false;
    },
    handleCheckedTableColumnsChange(item) {
      let totalCount = 0;
      let selectedCount = 0;
      this.tableColumns.forEach(column => {
        ++totalCount;
        selectedCount += column.visible ? 1 : 0;
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
      if (item.visible) {
        // Find a suitable insertion point
        const columnIndex = this.tableColumns.indexOf(item);
        vm.owner.store.commit('insertColumn', columnConfig, columnIndex + 1, null);
      } else {
        vm.owner.store.commit('removeColumn', columnConfig, null);
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

</style>
