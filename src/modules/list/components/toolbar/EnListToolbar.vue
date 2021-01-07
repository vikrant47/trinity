<template>
  <el-row :gutter="10">
    <el-col :span="18">
      <div class="action-list-wrapper" style="display: flex;">
        <EnAction
          v-for="action in actions"
          :key="action.id"
          :action="action"
          :context="{
            listComponent: $parent,
            listService: listService,
          }"
        />
      </div>
    </el-col>
    <el-col :span="6">
      <div class="list-operations">
        <el-input
          v-model="search"
          placeholder="Search"
          clearable
          suffix-icon="el-icon-search"
          style="width: 218px;"
          @keyup.enter.native="$emit('on-search',search)"
          @keyup.native="$emit('onSearchKeyUp',search)"
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
              :indeterminate="allColumnsSelectedIndeterminate"
              @change="handleCheckAllChange"
            >
              Select All
            </el-checkbox>
            <el-checkbox
              v-for="item in tableColumns"
              :key="item.field"
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
import Vue from 'vue';
import { Engine } from '@/modules/engine/core/engine';
import EnAction from '@/modules/engine/components/EnAction';

export default {
  name: 'EnListToolbar',
  components: { EnAction },
  props: {
    searchValue: {
      type: String,
      default: ''
    },
    hiddenColumns: {
      type: Array,
      default: () => []
    },
    ignoreColumns: {
      type: Array,
      default: () => []
    },
    actions: {
      type: Array,
      default: () => []
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
      tableColumns: [],
      search: ''
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
    this.search = this.searchValue;
    // this.$parent.crud.updateProp('searchToggle', true);
  },
  methods: {
    handleCheckAllChange(val) {
      if (val === true) {
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
        selectedCount += column.visible ? 1 : 0;
      });
      if (selectedCount === 0) {
        Engine.notify(this.$parent, {
          title: 'Please select at least one column',
          type: Engine.NOTIFICATION_TYPE.WARNING
        });
        return;
      }
      this.$nextTick(function() {
        //  item.visible = true;
      });
      this.allColumnsSelected = selectedCount === totalCount;
      this.allColumnsSelectedIndeterminate = selectedCount !== totalCount && selectedCount !== 0;
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
