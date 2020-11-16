<template>
  <div class="app-container">
    <en-form
      :model-alias="modelAlias"
      :form-id="formId"
      :record-id="recordId"
      :remote="true"
    />
  </div>
</template>

<script>
import EnForm from '@/modules/form/components/engine/EnForm';

export default {
  name: 'FormRenderer',
  components: { EnForm },
  props: {
    modelAlias: { type: String, default: null },
    recordId: { type: String, default: 'new' },
    formId: { type: String, default: 'default' }
  },
  beforeCreate() {
  }
};
</script>

<style scoped>

</style>
