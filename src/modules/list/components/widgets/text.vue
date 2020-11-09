<template functional>
  <div class="cell-wrapper">
    {{ props.row[props.column.field] }}
  </div>
</template>
<script>
export default {
  name: 'TextWidget',
  props: {
    row: {
      type: Object,
      required: true
    },
    column: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>

</style>
