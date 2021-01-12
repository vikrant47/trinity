<template>
  <div class="cell-wrapper">
    {{ value }}
  </div>
</template>
<script>
import BaseWidget from '@/modules/list/components/widgets/base-widget';
export default {
  name: 'ReferenceWidget',
  extends: BaseWidget,
  data() {
    return {
      value: this.row['ref_' + this.column.name] ? this.row['ref_' + this.column.name][this.column.display_field_name] : this.row[this.column.name]
    };
  }
};
</script>

<style scoped>

</style>
