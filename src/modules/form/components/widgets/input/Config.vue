<template>
  <div class="input-config">
    <base-widget-config :active-data="activeData" />
  </div>
</template>

<script>
import BaseWidgetConfig from '@/modules/form/components/widgets/base-widget/BaseWidgetConfig';

export default {
  name: 'Config',
  components: { BaseWidgetConfig },
  extends: BaseWidgetConfig
};
</script>

<style scoped>

</style>
