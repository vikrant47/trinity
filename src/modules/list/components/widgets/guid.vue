<template>
  <div class="cell-wrapper">
    <span v-if="column.name!=='id'">{{ value }}</span>
    <el-link
      v-if="column.name==='id'"
      icon="el-icon-edit"
      @click="click($event)"
    >
      <span>{{ value }}</span>
    </el-link>
  </div>
</template>

<script>
import BaseWidget from '@/modules/list/components/widgets/base-widget';

export default {
  name: 'Guid',
  with: '30',
  extends: BaseWidget,
};
</script>

<style scoped>

</style>
