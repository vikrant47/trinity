<template>
  <div class="right-board">
    <el-tabs v-model="currentTab" class="center-tabs">
      <el-tab-pane label="Component properties" name="field" />
      <el-tab-pane label="Form attributes" name="form" />
    </el-tabs>
    <div class="field-box">
      <a class="document-link" target="_blank" :href="documentLink" title="View component documentation">
        <i class="el-icon-link" />
      </a>
      <el-scrollbar class="right-scrollbar">
        <!-- Component properties -->
        <el-form v-show="currentTab==='field' && showField" size="small" label-width="90px">
          <div
            :is="widgets[activeData.__config__.tag].config"
            v-if="widgets[activeData.__config__.tag]"
            :active-data="activeData"
            class="widget-config-container"
          />
          <base-widget-config v-else :active-data="activeData" />
        </el-form>
        <!-- Form attributes -->
        <el-form v-show="currentTab === 'form'" size="small" label-width="90px">
          <el-form-item label="Form name">
            <el-input v-model="formConf.formRef" placeholder="Enter the form name (ref)" />
          </el-form-item>
          <el-form-item label="Model">
            <el-input v-model="formConf.formModel" placeholder="Enter data model" />
          </el-form-item>
          <el-form-item label="Validation model">
            <el-input v-model="formConf.formRules" placeholder="Enter the verification model" />
          </el-form-item>
          <el-form-item label="Form size">
            <el-radio-group v-model="formConf.size">
              <el-radio-button label="medium">
                Medium
              </el-radio-button>
              <el-radio-button label="small">
                Small
              </el-radio-button>
              <el-radio-button label="mini">
                Mini
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Label Position">
            <el-radio-group v-model="formConf.labelPosition">
              <el-radio-button label="left">
                Left
              </el-radio-button>
              <el-radio-button label="right">
                Right
              </el-radio-button>
              <el-radio-button label="top">
                Top
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Label width">
            <el-input v-model.number="formConf.labelWidth" type="number" placeholder="Enter the label width" />
          </el-form-item>
          <el-form-item label="Spacing">
            <el-input-number v-model="formConf.gutter" :min="0" placeholder="Spacing" />
          </el-form-item>
          <el-form-item label="Disabled">
            <el-switch v-model="formConf.disabled" />
          </el-form-item>
          <el-form-item label="Button">
            <el-switch v-model="formConf.formBtns" />
          </el-form-item>
          <el-form-item label="Border">
            <el-switch v-model="formConf.unFocusedComponentBorder" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>

    <treeNode-dialog :visible.sync="dialogVisible" title="Add option" @commit="addNode" />
    <icons-dialog :visible.sync="iconsVisible" :current="activeData[currentIconModel]" @select="setIcon" />
  </div>
</template>

<script>
import { isArray } from 'util';
import TreeNodeDialog from '@/modules/form/views/index/TreeNodeDialog';
import { isNumberStr } from '@/modules/form/utils';
import IconsDialog from './IconsDialog';
import {
  inputComponents, selectComponents, layoutComponents
} from '@/modules/form/components/generator/config';
import { saveFormConf } from '@/modules/form/utils/db';
import widgets from '@/modules/form/components/widgets';
import BaseWidgetConfig from '@/modules/form/components/widgets/base-widget/BaseWidgetConfig';

const dateTimeFormat = {
  date: 'yyyy-MM-dd',
  week: 'yyyy 第 WW 周',
  month: 'yyyy-MM',
  year: 'yyyy',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  monthrange: 'yyyy-MM',
  datetimerange: 'yyyy-MM-dd HH:mm:ss'
};

// Make the change Render Key available when the target component changes
const needRerenderList = ['tinymce'];

export default {
  components: {
    BaseWidgetConfig,
    TreeNodeDialog,
    IconsDialog
  },
  props: ['showField', 'activeData', 'formConf'],
  data() {
    return {
      widgets,
      currentTab: 'field',
      currentNode: null,
      dialogVisible: false,
      iconsVisible: false,
      currentIconModel: null,
      layoutTreeProps: {
        label(data, node) {
          const config = data.__config__;
          return data.componentName || `${config.label}: ${data.__vModel__}`;
        }
      }
    };
  },
  computed: {
    widgetConfigComponent() {
      const widget = widgets[this.activeData.__config__.tag];
      const config = widget.config;
      if (typeof config === 'function') {
        return config();
      }
      return config;
    },
    documentLink() {
      return (
        this.activeData.__config__.document ||
        'https://element.eleme.cn/#/zh-CN/component/installation'
      );
    },
    dateOptions() {
      if (
        this.activeData.type !== undefined &&
        this.activeData.__config__.tag === 'el-date-picker'
      ) {
        if (this.activeData['start-placeholder'] === undefined) {
          return this.dateTypeOptions;
        }
        return this.dateRangeTypeOptions;
      }
      return [];
    },
    tagList() {
      return [
        {
          label: '输入型组件',
          options: inputComponents
        },
        {
          label: '选择型组件',
          options: selectComponents
        }
      ];
    },
    activeTag() {
      return this.activeData.__config__.tag;
    },
    isShowMin() {
      return ['el-input-number', 'el-slider'].indexOf(this.activeTag) > -1;
    },
    isShowMax() {
      return ['el-input-number', 'el-slider', 'el-rate'].indexOf(this.activeTag) > -1;
    },
    isShowStep() {
      return ['el-input-number', 'el-slider'].indexOf(this.activeTag) > -1;
    }
  },
  watch: {
    formConf: {
      handler(val) {
        saveFormConf(val);
      },
      deep: true
    }
  },
  methods: {
    addReg() {
      this.activeData.__config__.regList.push({
        pattern: '',
        message: ''
      });
    },
    addSelectItem() {
      this.activeData.__slot__.options.push({
        label: '',
        value: ''
      });
    },
    addTreeItem() {
      ++this.idGlobal;
      this.dialogVisible = true;
      this.currentNode = this.activeData.options;
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class='custom-tree-node'>
          <span>{node.label}</span>
          <span class='node-operation'>
            <i on-click={() => this.append(data)}
              class='el-icon-plus'
              title='添加'
            ></i>
            <i on-click={() => this.remove(node, data)}
              class='el-icon-delete'
              title='删除'
            ></i>
          </span>
        </div>
      );
    },
    append(data) {
      if (!data.children) {
        this.$set(data, 'children', []);
      }
      this.dialogVisible = true;
      this.currentNode = data.children;
    },
    remove(node, data) {
      this.activeData.__config__.defaultValue = []; // 避免删除时报错
      const { parent } = node;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    addNode(data) {
      this.currentNode.push(data);
    },
    setOptionValue(item, val) {
      item.value = isNumberStr(val) ? +val : val;
    },
    setDefaultValue(val) {
      if (Array.isArray(val)) {
        return val.join(',');
      }
      // if (['string', 'number'].indexOf(typeof val) > -1) {
      //   return val
      // }
      if (typeof val === 'boolean') {
        return `${val}`;
      }
      return val;
    },
    onDefaultValueInput(str) {
      if (isArray(this.activeData.__config__.defaultValue)) {
        // 数组
        this.$set(
          this.activeData.__config__,
          'defaultValue',
          str.split(',').map(val => (isNumberStr(val) ? +val : val))
        );
      } else if (['true', 'false'].indexOf(str) > -1) {
        // 布尔
        this.$set(this.activeData.__config__, 'defaultValue', JSON.parse(str));
      } else {
        // 字符串和数字
        this.$set(
          this.activeData.__config__,
          'defaultValue',
          isNumberStr(str) ? +str : str
        );
      }
    },
    onSwitchValueInput(val, name) {
      if (['true', 'false'].indexOf(val) > -1) {
        this.$set(this.activeData, name, JSON.parse(val));
      } else {
        this.$set(this.activeData, name, isNumberStr(val) ? +val : val);
      }
    },
    setTimeValue(val, type) {
      const valueFormat = type === 'week' ? dateTimeFormat.date : val;
      this.$set(this.activeData.__config__, 'defaultValue', null);
      this.$set(this.activeData, 'value-format', valueFormat);
      this.$set(this.activeData, 'format', val);
    },
    spanChange(val) {
      this.formConf.span = val;
    },
    multipleChange(val) {
      this.$set(this.activeData.__config__, 'defaultValue', val ? [] : '');
    },
    dateTypeChange(val) {
      this.setTimeValue(dateTimeFormat[val], val);
    },
    rangeChange(val) {
      this.$set(
        this.activeData.__config__,
        'defaultValue',
        val ? [this.activeData.min, this.activeData.max] : this.activeData.min
      );
    },
    rateTextChange(val) {
      if (val) this.activeData['show-score'] = false;
    },
    rateScoreChange(val) {
      if (val) this.activeData['show-text'] = false;
    },
    colorFormatChange(val) {
      this.activeData.__config__.defaultValue = null;
      this.activeData['show-alpha'] = val.indexOf('a') > -1;
      this.activeData.__config__.renderKey = +new Date(); // 更新renderKey,重新渲染该组件
    },
    openIconsDialog(model) {
      this.iconsVisible = true;
      this.currentIconModel = model;
    },
    setIcon(val) {
      this.activeData[this.currentIconModel] = val;
    },
    tagChange(tagIcon) {
      let target = inputComponents.find(item => item.__config__.tagIcon === tagIcon);
      if (!target) target = selectComponents.find(item => item.__config__.tagIcon === tagIcon);
      this.$emit('tag-change', target);
    },
    changeRenderKey() {
      if (needRerenderList.includes(this.activeData.__config__.tag)) {
        this.activeData.__config__.renderKey = +new Date();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.right-board {
  height: 100%;
  overflow: scroll;
  /*width: 350px;
  position: absolute;
  right: 0;
  top: 0;
  padding-top: 3px;*/
}

.field-box {
  position: relative;
  height: calc(100vh - 42px);
  box-sizing: border-box;
  overflow: hidden;
}

.el-scrollbar {
  height: 100%;
}

.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;

  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }

  & .el-input + .el-input {
    margin-left: 4px;
  }
}

.select-item + .select-item {
  margin-top: 4px;
}

.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}

.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}

.option-drag {
  cursor: move;
}

.time-range {
  .el-date-editor {
    width: 227px;
  }

  ::v-deep .el-icon-time {
    display: none;
  }
}

.document-link {
  position: absolute;
  display: block;
  width: 26px;
  height: 26px;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #409eff;
  z-index: 1;
  border-radius: 0 0 6px 0;
  text-align: center;
  line-height: 26px;
  color: #fff;
  font-size: 18px;
}

.node-label {
  font-size: 14px;
}

.node-icon {
  color: #bebfc3;
}
</style>
