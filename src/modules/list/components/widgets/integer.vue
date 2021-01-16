<template>
  <div class="cell-wrapper">
    <span v-if="!href">{{ value }}</span>
    <el-link
      v-if="href"
      @click="$emit('click',row,column)"
    >
      <span>{{ value }}</span>
    </el-link>
  </div>
</template>

<script>
import BaseWidget from '@/modules/list/components/widgets/base-widget';

export default {
  name: 'Integer',
  with: '30',
  extends: BaseWidget
};
</script>

<style scoped>

</style>
