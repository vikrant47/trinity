<template>
  <div class="button-config">
    <base-widget-config :active-data="activeData" />
    <el-form-item
      v-if="activeData['icon']!==undefined && activeData.component.tag === 'el-button'"
      label="Icon"
    >
      <el-input v-model="activeData['icon']" placeholder="Enter the button icon name">
        <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('icon')">
          选择
        </el-button>
      </el-input>
    </el-form-item>
    <el-form-item
      v-if="activeData.type !== undefined && activeData.component.tag === 'el-button'"
      label="按钮类型"
    >
      <el-select v-model="activeData.type" :style="{ width: '100%' }">
        <el-option label="primary" value="primary" />
        <el-option label="success" value="success" />
        <el-option label="warning" value="warning" />
        <el-option label="danger" value="danger" />
        <el-option label="info" value="info" />
        <el-option label="text" value="text" />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="activeData.component.tag === 'el-button'"
      label="Button text"
    >
      <el-input v-model="activeData.slot.default" placeholder="Enter the button text" />
    </el-form-item>
    <el-form-item
      v-if="activeData.size !== undefined &&
        (activeData.component.optionType === 'button' ||
        activeData.component.border ||
        activeData.component.tag === 'el-color-picker' ||
        activeData.component.tag === 'el-button')"
      label="Widget size"
    >
      <el-radio-group v-model="activeData.size">
        <el-radio-button label="medium">
          中等
        </el-radio-button>
        <el-radio-button label="small">
          较小
        </el-radio-button>
        <el-radio-button label="mini">
          迷你
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
  </div>
</template>

<script>

import BaseWidgetConfig from '@/modules/form/components/widgets/base-widget/BaseWidgetConfig';

export default {
  name: 'Config',
  components: { BaseWidgetConfig },
  extends: BaseWidgetConfig
};
</script>

<style scoped>

</style>
