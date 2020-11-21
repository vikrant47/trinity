<template>
  <div class="cascader-config">
    <base-widget-config :active-data="activeData" />
    <el-form-item v-if="activeData.component.tag === 'el-cascader'" label="Separator">
      <el-input v-model="activeData.separator" placeholder="Enter option separator" />
    </el-form-item>
    <el-form-item v-if="activeData.component.tag === 'el-cascader'" label="任选层级">
      <el-switch v-model="activeData.props.props.checkStrictly" />
    </el-form-item>
    <el-form-item v-if="activeData.component.tag === 'el-cascader'" label="是否多选">
      <el-switch v-model="activeData.props.props.multiple" />
    </el-form-item>
    <el-form-item v-if="activeData.component.tag === 'el-cascader'" label="展示全路径">
      <el-switch v-model="activeData['show-all-levels']" />
    </el-form-item>
    <el-form-item v-if="activeData.component.tag === 'el-cascader'" label="可否筛选">
      <el-switch v-model="activeData.filterable" />
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
