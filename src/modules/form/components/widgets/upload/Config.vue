<template>
  <el-form-item v-if="activeData.component.widget === 'el-upload'" label="多选文件">
    <el-switch v-model="activeData.multiple" />
  </el-form-item>
</template>

<script>
export default {
  name: 'Config',
  extends: BaseWidgetConfig
};
</script>

<style scoped>

</style>
