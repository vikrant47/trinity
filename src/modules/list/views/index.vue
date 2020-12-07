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
import { EngineForm } from '@/modules/form/engine-api/engine.form';

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
      if (column.field === 'id') {
        EngineForm.navigate(this.modelAlias, 'default', 'update', row.id);
      }
    }
  }

};
</script>

<style scoped>
</style>
