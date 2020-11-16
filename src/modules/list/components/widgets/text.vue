<template>
  <div class="cell-wrapper">
    {{ row[column.field] }}
  </div>
</template>
<script>

export default {
  name: 'TextWidget',
  props: {
    href: {
      type: Boolean,
      default: false
    },
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
