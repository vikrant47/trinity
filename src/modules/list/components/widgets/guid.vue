<template functional>
  <div class="cell-wrapper">
    {{ props.row[props.column] }}
  </div>
</template>

<script>
export default {
  name: 'Guid',
  with: '30'
};
</script>

<style scoped>

</style>
