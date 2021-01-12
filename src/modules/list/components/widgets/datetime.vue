<template>
  <div class="cell-wrapper">
    <i class="el-icon-time" />
    <span style="margin-left: 10px">{{ value }}</span>
  </div>
</template>
<script>
import BaseWidget from '@/modules/list/components/widgets/base-widget';

export default {
  name: 'DateTime',
  extends: BaseWidget
};
</script>

<style scoped>

</style>
