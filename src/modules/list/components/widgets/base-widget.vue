<template>
  <div class="cell-wrapper">
    {{ value }}
  </div>
</template>
<script>

export default {
  name: 'BaseWidget',
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
  },
  data() {
    return {
      value: this.row[this.column.name]
    };
  }
};
</script>

<style scoped>

</style>
