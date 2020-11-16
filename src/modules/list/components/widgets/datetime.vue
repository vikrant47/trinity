<template>
  <div class="cell-wrapper">
    <i class="el-icon-time" />
    <span style="margin-left: 10px">{{ row[column.field] }}</span>
  </div>
</template>
<script>
import TextWidget from './text';

export default {
  name: 'DateTime',
  extends: TextWidget
};
</script>

<style scoped>

</style>
