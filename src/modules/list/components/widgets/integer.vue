<template functional>
  <div class="cell-wrapper">
    <i class="el-icon-time" />
    <span style="margin-left: 10px">{{ props.row[props.column.field] }}</span>
  </div>
</template>
<script>
import TextWidget from './text';

export default {
  name: 'IntegerWidget',
  extends: TextWidget
};
</script>

<style scoped>

</style>
