<template>
  <div class="app-container">
    <EnList
      :model-alias="modelAlias"
      :pagination="{}"
      :toolbar="true"
      :list="list"
      :remote="true"
      @cellClick="cellClick"
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
  },
  methods: {
    cellClick(event, row, column) {
    }
  }

};
</script>

<style scoped>
</style>
