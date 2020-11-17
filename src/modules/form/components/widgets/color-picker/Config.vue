<template>
  <div class="color-picker-config">
    <base-widget-config :active-data="activeData" />
    <el-form-item v-if="activeData.__config__.tag === 'el-color-picker'" label="Color format">
      <el-select
        v-model="activeData['color-format']"
        placeholder="Choose color format"
        :style="{ width: '100%' }"
        clearable
        @change="colorFormatChange"
      >
        <el-option
          v-for="(item, index) in colorFormatOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="activeData.size !== undefined &&
        (activeData.__config__.optionType === 'button' ||
        activeData.__config__.border ||
        activeData.__config__.tag === 'el-color-picker' ||
        activeData.__config__.tag === 'el-button')"
      label="Widget size"
    >
      <el-radio-group v-model="activeData.size">
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
