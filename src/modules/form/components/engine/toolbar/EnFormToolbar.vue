<template>
  <el-row :gutter="10">
    <el-col :span="24">
      <div class="action-form-wrapper" style="display: flex;">
        <EnAction
          v-for="action in actions"
          :id="action.id"
          :key="action.id"
          :type="action.type"
          :children="action.children"
          :name="action.name"
          :icon="action.icon"
          :label="action.label"
          :shape="action.shape"
          :has-parent="action.child===true"
          :processor="action.processor"
          :context="{
            formComponent: $parent,
            formService: formService,
          }"
        />
      </div>
    </el-col>
  </el-row>

</template>

<script>
import Vue from 'vue';
import EnAction from '@/modules/engine/components/EnAction';

export default {
  name: 'EnFormToolbar',
  components: { EnAction },
  props: {
    actions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formService: null,
      formEventHandler: null
    };
  },
  created() {
    const formService = this.$parent.formService;
    const formEventHandler = this.$parent.formEventHandler;
    Vue.set(this, 'formService', formService);
    Vue.set(this, 'formEventHandler', formEventHandler);
    // this.$parent.crud.updateProp('searchToggle', true);
  },
  methods: {}
};
</script>

<style scoped>
.form-operations {
  float: right;
}
</style>
