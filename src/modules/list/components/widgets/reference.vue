<template>
  <div class="cell-wrapper">
    <el-link
      @click="click($event)"
    >
      <span>{{ value }}</span>
      <i class="el-icon-link" />
    </el-link>
  </div>
</template>
<script>
import BaseWidget from '@/modules/list/components/widgets/base-widget';

export default {
  name: 'ReferenceWidget',
  extends: BaseWidget,
  computed: {
    value() {
      return this.row['ref_' + this.column.name] ? this.row['ref_' + this.column.name][this.column.display_field_name] : this.row[this.column.name];
    }
  }
};
</script>

<style scoped>

</style>
