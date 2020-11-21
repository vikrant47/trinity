<template>
  <div class="select-config">
    <base-widget-config :active-data="activeData" />
    <el-form-item v-if="activeData.component.tag === 'el-select'" label="Searchable">
      <el-switch v-model="activeData.filterable" />
    </el-form-item>
    <el-form-item v-if="activeData.component.tag === 'el-select'" label="Multiple">
      <el-switch v-model="activeData.multiple" @change="multipleChange" />
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
