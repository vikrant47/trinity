<template>
  <div class="cell-wrapper">
    <span>{{ value }}</span>
  </div>
</template>

<script>
import BaseWidget from '@/modules/list/components/widgets/base-widget';

export default {
  name: 'Number',
  with: '80',
  extends: BaseWidget
};
</script>

<style scoped>
.cell-wrapper{
  text-align: right;
  padding-right: 10px;
}
</style>
