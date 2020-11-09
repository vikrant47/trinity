<template>
  <div class="app-container">
    <EnList
      :model-alias="modelAlias"
      :pagination="{}"
      :toolbar="true"
      :list="list"
      :remote="true"
    />
  </div>
</template>

<script>
import EnList from '@/modules/list/components/list/EnList';

export default {
  name: 'App',
  components: { EnList },
  // props: { modelAlias: { type: String, default: null }, list: { type: String, default: null } },
  beforeCreate() {
    this.modelAlias = this.$route.params.modelAlias;
    this.list = this.$route.params.list;
  }

};
</script>

<style scoped>
</style>
