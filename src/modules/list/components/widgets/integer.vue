<template>
  <div class="cell-wrapper">
    <span v-if="!href">{{ row[column.field] }}</span>
    <el-link
      v-if="href"
      @click="$emit('click',row,column)"
    >
      <span>{{ row[column.field] }}</span>
    </el-link>
  </div>
</template>

<script>
import PasswordWidget from '@/modules/list/components/widgets/text';

export default {
  name: 'Integer',
  with: '30',
  extends: CheckboxGroupWidget
};
</script>

<style scoped>

</style>
