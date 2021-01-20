<template>
  <div class="cell-wrapper">
    <i class="el-icon-time" />
    <span v-if="value" style="margin-left: 10px">{{ value|formatDate }}</span>
  </div>
</template>
<script>
import BaseWidget from '@/modules/list/components/widgets/base-widget';

export default {
  name: 'Date',
  extends: BaseWidget
};
</script>

<style scoped>

</style>

