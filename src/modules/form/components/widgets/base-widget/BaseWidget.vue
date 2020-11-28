<template>
  <el-form-item v-if="activeData.component.widget==='el-checkbox-group'" label="At least">
    <el-input-number
      :value="activeData.min"
      :min="0"
      placeholder="At least"
      @input="$set(activeData, 'min', $event?$event:undefined)"
    />
  </el-form-item>
  <el-form-item v-if="activeData.component.widget==='el-checkbox-group'" label="Up to optional">
    <el-input-number
      :value="activeData.max"
      :min="0"
      placeholder="Up to optional"
      @input="$set(activeData, 'max', $event?$event:undefined)"
    />

    <script>
      export default {
      name: 'BaseWidget'
      };
    </script>

    <style scoped />
  </el-form-item>
</template>
