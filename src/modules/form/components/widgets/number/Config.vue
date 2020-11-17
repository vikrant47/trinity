<template>
  <div class="number-config">
    <base-widget-config :active-data="activeData" />
    <el-form-item v-if="activeData.__config__.tag === 'el-input-number'" label="精度">
      <el-input-number v-model="activeData.precision" :min="0" placeholder="精度" />
    </el-form-item>
    <el-form-item v-if="activeData.__config__.tag === 'el-input-number'" label="按钮位置">
      <el-radio-group v-model="activeData['controls-position']">
        <el-radio-button label="">
          默认
        </el-radio-button>
        <el-radio-button label="right">
          右侧
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="activeData.__config__.tag === 'el-input-number'" label="严格步数">
      <el-switch v-model="activeData['step-strictly']" />
    </el-form-item>
  </div>
</template>

<script>
import BaseWidgetConfig from '@/modules/form/components/widgets/base-widget/BaseWidgetConfig';

export default {
  name: 'Config',
  extends: BaseWidgetConfig
};
</script>

<style scoped>

</style>
