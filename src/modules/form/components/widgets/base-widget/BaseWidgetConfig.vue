<template>
  <div class="config-wrapper">
    <el-form-item v-if="activeData.component.changeTag" label="Type">
      <el-select
        v-model="activeData.component.tagIcon"
        placeholder="Please select component type"
        :style="{width: '100%'}"
        @change="$emit('widget-change',$event)"
      >
        <el-option-group v-for="group in tagList" :key="group.label" :label="group.label">
          <el-option
            v-for="item in group.options"
            :key="item.component.label"
            :label="item.component.label"
            :value="item.component.tagIcon"
          >
            <svg-icon class="node-icon" :icon-class="item.component.tagIcon" />
            <span> {{ item.component.label }}</span>
          </el-option>
        </el-option-group>
      </el-select>
    </el-form-item>
    <el-form-item v-if="activeData.__vModel__!==undefined" label="Name">
      <el-input v-model="activeData.__vModel__" placeholder="Enter the field name" />
    </el-form-item>
    <el-form-item v-if="activeData.component.componentName!==undefined" label="Widget">
      {{ activeData.component.componentName }}
    </el-form-item>
    <el-form-item v-if="activeData.component.label!==undefined" label="Title">
      <el-input v-model="activeData.component.label" placeholder="Please enter title" @input="changeRenderKey" />
    </el-form-item>
    <el-form-item v-if="activeData.placeholder!==undefined" label="Placeholder">
      <el-input v-model="activeData.placeholder" placeholder="Enter hint" @input="changeRenderKey" />
    </el-form-item>
    <el-form-item v-if="activeData['start-placeholder']!==undefined" label="Start occupying">
      <el-input v-model="activeData['start-placeholder']" placeholder="Start placeholder hint" />
    </el-form-item>
    <el-form-item v-if="activeData['end-placeholder']!==undefined" label="End placeholder">
      <el-input v-model="activeData['end-placeholder']" placeholder="End a placeholder hint" />
    </el-form-item>
    <el-form-item v-if="activeData.component.span!==undefined" label="Size">
      <el-slider v-model="activeData.component.span" :max="24" :min="1" :marks="{12:''}" @change="spanChange" />
    </el-form-item>
    <el-form-item
      v-if="activeData.component.layout==='rowFormItem'&&activeData.gutter!==undefined"
      label="Grid interval"
    >
      <el-input-number v-model="activeData.gutter" :min="0" placeholder="Grid interval" />
    </el-form-item>
    <el-form-item v-if="activeData.component.layout==='rowFormItem'&&activeData.type!==undefined" label="Layout mode">
      <el-radio-group v-model="activeData.type">
        <el-radio-button label="default" />
        <el-radio-button label="flex" />
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="activeData.justify!==undefined&&activeData.type==='flex'" label="Horizontal Alignment">
      <el-select v-model="activeData.justify" placeholder="Select Alignment" :style="{width: '100%'}">
        <el-option
          v-for="(item, index) in justifyOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item v-if="activeData.align!==undefined&&activeData.type==='flex'" label="Vertical Alignment">
      <el-radio-group v-model="activeData.align">
        <el-radio-button label="top" />
        <el-radio-button label="middle" />
        <el-radio-button label="bottom" />
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="activeData.component.labelWidth!==undefined" label="Label width">
      <el-input v-model.number="activeData.component.labelWidth" type="number" placeholder="Enter the label width" />
    </el-form-item>
    <el-form-item v-if="activeData.style&&activeData.style.width!==undefined" label="Component width">
      <el-input v-model="activeData.style.width" placeholder="Component width" clearable />
    </el-form-item>
    <el-form-item v-if="activeData.__vModel__!==undefined" label="Defaults">
      <el-input
        :value="setDefaultValue(activeData.component.defaultValue)"
        placeholder="Default value"
        @input="onDefaultValueInput"
      />
    </el-form-item>
    <el-form-item v-if="activeData.slot&&activeData.slot.prepend!==undefined" label="Prefix">
      <el-input v-model="activeData.slot.prepend" placeholder="Enter a prefix" />
    </el-form-item>
    <el-form-item v-if="activeData.slot&&activeData.slot.append!==undefined" label="Suffix">
      <el-input v-model="activeData.slot.append" placeholder="Enter the suffix" />
    </el-form-item>
    <el-form-item v-if="activeData['prefix-icon']!==undefined" label="Front icon">
      <el-input v-model="activeData['prefix-icon']" placeholder="Name of the former icon">
        <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('prefix-icon')">
          选择
        </el-button>
      </el-input>
    </el-form-item>
    <el-form-item v-if="activeData['suffix-icon'] !== undefined" label="Back icon">
      <el-input v-model="activeData['suffix-icon']" placeholder="Please enter the name of the icon">
        <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('suffix-icon')">
          选择
        </el-button>
      </el-input>
    </el-form-item>
    <el-form-item v-if="activeData.autosize !== undefined" label="Minimum rows">
      <el-input-number v-model="activeData.autosize.minRows" :min="1" placeholder="Minimum number of rows" />
    </el-form-item>
    <el-form-item v-if="activeData.autosize !== undefined" label="Maximum rows">
      <el-input-number v-model="activeData.autosize.maxRows" :min="1" placeholder="Maximum number of rows" />
    </el-form-item>
    <el-form-item v-if="isShowMin" label="Min">
      <el-input-number v-model="activeData.min" placeholder="Minimum" />
    </el-form-item>
    <el-form-item v-if="isShowMax" label="Max">
      <el-input-number v-model="activeData.max" placeholder="Maximum" />
    </el-form-item>
    <el-form-item v-if="activeData.height!==undefined" label="Widget Height">
      <el-input-number v-model="activeData.height" placeholder="Height" @input="changeRenderKey" />
    </el-form-item>
    <el-form-item v-if="isShowStep" label="Stride">
      <el-input-number v-model="activeData.step" placeholder="Step count" />
    </el-form-item>
    <el-form-item v-if="activeData.maxlength !== undefined" label="Maximum input">
      <el-input v-model="activeData.maxlength" placeholder="Enter the character length">
        <template slot="append">
          个字符
        </template>
      </el-input>
    </el-form-item>
    <el-form-item v-if="activeData['active-text'] !== undefined" label="Turn on prompt">
      <el-input v-model="activeData['active-text']" placeholder="Enter the opening prompt" />
    </el-form-item>
    <el-form-item v-if="activeData['inactive-text'] !== undefined" label="Close prompt">
      <el-input v-model="activeData['inactive-text']" placeholder="Enter close prompt" />
    </el-form-item>
    <el-form-item v-if="activeData['active-value'] !== undefined" label="Open value">
      <el-input
        :value="setDefaultValue(activeData['active-value'])"
        placeholder="Enter an open value"
        @input="onSwitchValueInput($event, 'active-value')"
      />
    </el-form-item>
    <el-form-item v-if="activeData['inactive-value'] !== undefined" label="Close value">
      <el-input
        :value="setDefaultValue(activeData['inactive-value'])"
        placeholder="Enter a Close Value"
        @input="onSwitchValueInput($event, 'inactive-value')"
      />
    </el-form-item>
    <el-form-item
      v-if="activeData.type !== undefined && 'el-date-picker' === activeData.component.widget"
      label="Time type"
    >
      <el-select
        v-model="activeData.type"
        placeholder="Select the time type"
        :style="{ width: '100%' }"
        @change="dateTypeChange"
      >
        <el-option
          v-for="(item, index) in dateOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item v-if="activeData.name !== undefined" label="File field name">
      <el-input v-model="activeData.name" placeholder="Enter the upload file field name" />
    </el-form-item>
    <el-form-item v-if="activeData.accept !== undefined" label="file type">
      <el-select
        v-model="activeData.accept"
        placeholder="Select file type"
        :style="{ width: '100%' }"
        clearable
      >
        <el-option label="image" value="image/*" />
        <el-option label="video" value="video/*" />
        <el-option label="audio" value="audio/*" />
        <el-option label="excel" value=".xls,.xlsx" />
        <el-option label="word" value=".doc,.docx" />
        <el-option label="pdf" value=".pdf" />
        <el-option label="txt" value=".txt" />
      </el-select>
    </el-form-item>
    <el-form-item v-if="activeData.component.fileSize !== undefined" label="File size">
      <el-input v-model.number="activeData.component.fileSize" placeholder="Enter file size">
        <el-select slot="append" v-model="activeData.component.sizeUnit" :style="{ width: '66px' }">
          <el-option label="KB" value="KB" />
          <el-option label="MB" value="MB" />
          <el-option label="GB" value="GB" />
        </el-select>
      </el-input>
    </el-form-item>
    <el-form-item v-if="activeData.action !== undefined" label="Upload address">
      <el-input v-model="activeData.action" placeholder="Enter upload address" clearable />
    </el-form-item>
    <el-form-item v-if="activeData['list-type'] !== undefined" label="List type">
      <el-radio-group v-model="activeData['list-type']" size="small">
        <el-radio-button label="text">
          text
        </el-radio-button>
        <el-radio-button label="picture">
          picture
        </el-radio-button>
        <el-radio-button label="picture-card">
          picture-card
        </el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item
      v-if="activeData.component.buttonText !== undefined"
      v-show="'picture-card' !== activeData['list-type']"
      label="按钮文字"
    >
      <el-input v-model="activeData.component.buttonText" placeholder="Enter the button text" />
    </el-form-item>
    <el-form-item v-if="activeData['range-separator'] !== undefined" label="Delimiter">
      <el-input v-model="activeData['range-separator']" placeholder="Enter a separator" />
    </el-form-item>
    <el-form-item v-if="activeData['picker-options'] !== undefined" label="Period">
      <el-input
        v-model="activeData['picker-options'].selectableRange"
        placeholder="Enter the time period"
      />
    </el-form-item>
    <el-form-item v-if="activeData.format !== undefined" label="Time format">
      <el-input
        :value="activeData.format"
        placeholder="Enter the time format"
        @input="setTimeValue($event)"
      />
    </el-form-item>
    <template v-if="['el-checkbox-group', 'el-radio-group', 'el-select'].indexOf(activeData.component.widget) > -1">
      <el-divider>Options</el-divider>
      <draggable
        :list="activeData.slot.options"
        :animation="340"
        group="selectItem"
        handle=".option-drag"
      >
        <div v-for="(item, index) in activeData.slot.options" :key="index" class="select-item">
          <div class="select-line-icon option-drag">
            <i class="el-icon-s-operation" />
          </div>
          <el-input v-model="item.label" placeholder="Option name" size="small" />
          <el-input
            placeholder="Option value"
            size="small"
            :value="item.value"
            @input="setOptionValue(item, $event)"
          />
          <div class="close-btn select-line-icon" @click="activeData.slot.options.splice(index, 1)">
            <i class="el-icon-remove-outline" />
          </div>
        </div>
      </draggable>
      <div style="margin-left: 20px;">
        <el-button
          style="padding-bottom: 0"
          icon="el-icon-circle-plus-outline"
          type="text"
          @click="addSelectItem"
        >
          Add option
        </el-button>
      </div>
      <el-divider />
    </template>

    <template v-if="['el-cascader', 'el-table'].includes(activeData.component.widget)">
      <el-divider>Options</el-divider>
      <el-form-item v-if="activeData.component.dataType" label="type of data">
        <el-radio-group v-model="activeData.component.dataType" size="small">
          <el-radio-button label="dynamic">
            dynamic data
          </el-radio-button>
          <el-radio-button label="static">
            Static data
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <template v-if="activeData.component.dataType === 'dynamic'">
        <el-form-item label="interface address">
          <el-input
            v-model="activeData.component.url"
            :title="activeData.component.url"
            placeholder="Enter the interface address"
            clearable
            @blur="$emit('fetch-data', activeData)"
          >
            <el-select
              slot="prepend"
              v-model="activeData.component.method"
              :style="{width: '85px'}"
              @change="$emit('fetch-data', activeData)"
            >
              <el-option label="get" value="get" />
              <el-option label="post" value="post" />
              <el-option label="put" value="put" />
              <el-option label="delete" value="delete" />
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="Data location">
          <el-input
            v-model="activeData.component.dataPath"
            placeholder="Enter data location"
            @blur="$emit('fetch-data', activeData)"
          />
        </el-form-item>

        <template v-if="activeData.props && activeData.props.props">
          <el-form-item label="Label key name">
            <el-input v-model="activeData.props.props.label" placeholder="Enter the label key name" />
          </el-form-item>
          <el-form-item label="Value key name">
            <el-input v-model="activeData.props.props.value" placeholder="Enter the value key name" />
          </el-form-item>
          <el-form-item label="Child key name">
            <el-input v-model="activeData.props.props.children" placeholder="Enter the child key name" />
          </el-form-item>
        </template>
      </template>

      <!-- Cascading selection static tree -->
      <el-tree
        v-if="activeData.component.dataType === 'static'"
        draggable
        :data="activeData.options"
        node-key="id"
        :expand-on-click-node="false"
        :render-content="renderContent"
      />
      <div v-if="activeData.component.dataType === 'static'" style="margin-left: 20px">
        <el-button
          style="padding-bottom: 0"
          icon="el-icon-circle-plus-outline"
          type="text"
          @click="addTreeItem"
        >
          Add parent
        </el-button>
      </div>
      <el-divider />
    </template>

    <el-form-item v-if="activeData.component.optionType !== undefined" label="选项样式">
      <el-radio-group v-model="activeData.component.optionType">
        <el-radio-button label="default">
          default
        </el-radio-button>
        <el-radio-button label="button">
          push button
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="activeData['active-color'] !== undefined" label="Turn on color">
      <el-color-picker v-model="activeData['active-color']" />
    </el-form-item>
    <el-form-item v-if="activeData['inactive-color'] !== undefined" label="Turn off color">
      <el-color-picker v-model="activeData['inactive-color']" />
    </el-form-item>

    <el-form-item
      v-if="activeData.component.showLabel !== undefined
        && activeData.component.labelWidth !== undefined"
      label="Show label"
    >
      <el-switch v-model="activeData.component.showLabel" />
    </el-form-item>
    <el-form-item v-if="activeData.branding !== undefined" label="Brand imprint">
      <el-switch v-model="activeData.branding" @input="changeRenderKey" />
    </el-form-item>
    <el-form-item v-if="activeData['allow-half'] !== undefined" label="Half-selection allowed">
      <el-switch v-model="activeData['allow-half']" />
    </el-form-item>
    <el-form-item v-if="activeData['show-text'] !== undefined" label="Auxiliary text">
      <el-switch v-model="activeData['show-text']" @change="rateTextChange" />
    </el-form-item>
    <el-form-item v-if="activeData['show-score'] !== undefined" label="Show score">
      <el-switch v-model="activeData['show-score']" @change="rateScoreChange" />
    </el-form-item>
    <el-form-item v-if="activeData['show-stops'] !== undefined" label="Show discontinuity">
      <el-switch v-model="activeData['show-stops']" />
    </el-form-item>
    <el-form-item v-if="activeData.range !== undefined" label="Range selection">
      <el-switch v-model="activeData.range" @change="rangeChange" />
    </el-form-item>
    <el-form-item
      v-if="activeData.component.border !== undefined && activeData.component.optionType === 'default'"
      label="Whether with border"
    >
      <el-switch v-model="activeData.component.border" />
    </el-form-item>
    <el-form-item v-if="activeData['show-word-limit'] !== undefined" label="Enter statistics">
      <el-switch v-model="activeData['show-word-limit']" />
    </el-form-item>
    <el-form-item v-if="activeData.clearable !== undefined" label="Allow Empty">
      <el-switch v-model="activeData.clearable" />
    </el-form-item>
    <el-form-item v-if="activeData.component.showTip !== undefined" label="Show hint">
      <el-switch v-model="activeData.component.showTip" />
    </el-form-item>
    <el-form-item v-if="activeData['auto-upload'] !== undefined" label="Auto upload">
      <el-switch v-model="activeData['auto-upload']" />
    </el-form-item>
    <el-form-item v-if="activeData.readonly !== undefined" label="Read only">
      <el-switch v-model="activeData.readonly" />
    </el-form-item>
    <el-form-item v-if="activeData.disabled !== undefined" label="Disabled">
      <el-switch v-model="activeData.disabled" />
    </el-form-item>
    <el-form-item v-if="activeData.component.required !== undefined" label="Required">
      <el-switch v-model="activeData.component.required" />
    </el-form-item>

    <template v-if="activeData.component.layoutTree">
      <el-divider>Layout tree</el-divider>
      <el-tree
        :data="[activeData.component]"
        :props="layoutTreeProps"
        node-key="renderKey"
        default-expand-all
        draggable
      >
        <span slot-scope="{ node, data }">
          <span class="node-label">
            <svg-icon class="node-icon" :icon-class="data.component?data.component.tagIcon:data.tagIcon" />
            {{ node.label }}
          </span>
        </span>
      </el-tree>
    </template>

    <template v-if="Array.isArray(activeData.component.regList)">
      <el-divider>Regular check</el-divider>
      <div
        v-for="(item, index) in activeData.component.regList"
        :key="index"
        class="reg-item"
      >
        <span class="close-btn" @click="activeData.component.regList.splice(index, 1)">
          <i class="el-icon-close" />
        </span>
        <el-form-item label="Regex">
          <el-input v-model="item.pattern" placeholder="Enter regular" />
        </el-form-item>
        <el-form-item label="Error message" style="margin-bottom:0">
          <el-input v-model="item.message" placeholder="Enter the wrong prompt" />
        </el-form-item>
      </div>
      <div style="margin-left: 20px">
        <el-button icon="el-icon-circle-plus-outline" type="text" @click="addReg">
          Add rule
        </el-button>
      </div>
    </template>
  </div>
</template>

<script>
import { isArray } from 'util';
import TreeNodeDialog from '@/modules/form/views/index/TreeNodeDialog';
import { isNumberStr } from '@/modules/form/utils';
import IconsDialog from '@/modules/form/views/index/IconsDialog';
import {
  inputComponents, selectComponents, layoutComponents
} from '@/modules/form/components/generator/config';
import { saveFormConf } from '@/modules/form/utils/db';
import draggable from 'vuedraggable';

export default {
  name: 'BaseWidgetConfig',
  components: {
    TreeNodeDialog,
    IconsDialog,
    draggable
  },
  props: {
    activeData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      currentTab: 'field',
      currentNode: null,
      dialogVisible: false,
      iconsVisible: false,
      currentIconModel: null,
      dateTypeOptions: [
        {
          label: 'Date',
          value: 'date'
        },
        {
          label: 'Week',
          value: 'week'
        },
        {
          label: 'Month',
          value: 'month'
        },
        {
          label: 'Year',
          value: 'year'
        },
        {
          label: 'Date Time)',
          value: 'datetime'
        }
      ],
      dateRangeTypeOptions: [
        {
          label: 'Date Range)',
          value: 'daterange'
        },
        {
          label: 'Month Range)',
          value: 'monthrange'
        },
        {
          label: 'Date Time Range)',
          value: 'datetimerange'
        }
      ],
      colorFormatOptions: [
        {
          label: 'hex',
          value: 'hex'
        },
        {
          label: 'rgb',
          value: 'rgb'
        },
        {
          label: 'rgba',
          value: 'rgba'
        },
        {
          label: 'hsv',
          value: 'hsv'
        },
        {
          label: 'hsl',
          value: 'hsl'
        }
      ],
      justifyOptions: [
        {
          label: 'start',
          value: 'start'
        },
        {
          label: 'end',
          value: 'end'
        },
        {
          label: 'center',
          value: 'center'
        },
        {
          label: 'space-around',
          value: 'space-around'
        },
        {
          label: 'space-between',
          value: 'space-between'
        }
      ],
      layoutTreeProps: {
        label(data, node) {
          const config = data.component;
          return data.componentName || `${config.label}: ${data.__vModel__}`;
        }
      }
    };
  },
  computed: {
    documentLink() {
      return (
        this.activeData.component.document ||
        'https://element.eleme.cn/#/zh-CN/component/installation'
      );
    },
    dateOptions() {
      if (
        this.activeData.type !== undefined &&
        this.activeData.component.widget === 'el-date-picker'
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
      return this.activeData.component.widget;
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
  }, methods: {
    addReg() {
      this.activeData.component.regList.push({
        pattern: '',
        message: ''
      });
    },
    addSelectItem() {
      this.activeData.slot.options.push({
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
              title='Add'
            />
            <i on-click={() => this.remove(node, data)}
              class='el-icon-delete'
              title='Delete'
            />
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
      this.activeData.component.defaultValue = []; // 避免删除时报错
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
      if (isArray(this.activeData.component.defaultValue)) {
        // 数组
        this.$set(
          this.activeData.component,
          'defaultValue',
          str.split(',').map(val => (isNumberStr(val) ? +val : val))
        );
      } else if (['true', 'false'].indexOf(str) > -1) {
        // 布尔
        this.$set(this.activeData.component, 'defaultValue', JSON.parse(str));
      } else {
        // 字符串和数字
        this.$set(
          this.activeData.component,
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
      this.$set(this.activeData.component, 'defaultValue', null);
      this.$set(this.activeData, 'value-format', valueFormat);
      this.$set(this.activeData, 'format', val);
    },
    spanChange(val) {
      this.formConf.span = val;
    },
    multipleChange(val) {
      this.$set(this.activeData.component, 'defaultValue', val ? [] : '');
    },
    dateTypeChange(val) {
      this.setTimeValue(dateTimeFormat[val], val);
    },
    rangeChange(val) {
      this.$set(
        this.activeData.component,
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
      this.activeData.component.defaultValue = null;
      this.activeData['show-alpha'] = val.indexOf('a') > -1;
      this.activeData.component.renderKey = +new Date(); // 更新renderKey,重新渲染该组件
    },
    openIconsDialog(model) {
      this.iconsVisible = true;
      this.currentIconModel = model;
    },
    setIcon(val) {
      this.activeData[this.currentIconModel] = val;
    },
    tagChange(tagIcon) {
      let target = inputComponents.find(item => item.component.tagIcon === tagIcon);
      if (!target) target = selectComponents.find(item => item.component.tagIcon === tagIcon);
      this.$emit('widget-change', target);
    },
    changeRenderKey() {
      if (needRerenderList.includes(this.activeData.component.widget)) {
        this.activeData.component.renderKey = +new Date();
      }
    }
  }
};
</script>

<style scoped>

</style>
