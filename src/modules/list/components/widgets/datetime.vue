<template>
  <div class="cell-wrapper">
    <i class="el-icon-time" />
    <span style="margin-left: 10px">{{ row[column.field] }}</span>
  </div>
</template>
<script>
import PasswordWidget from './text';

export default {
  name: 'DateTime',
  extends: CheckboxGroupWidget
};
</script>

<style scoped>

</style>
