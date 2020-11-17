<template>
  <div class="form-container">
    <parser :key="formService.hashCode" :form-conf="formService.formConfig" @submit="submitForm" />
  </div>
</template>

<script>

import Vue from 'vue';
import Parser from '@/modules/form/components/parser/Parser';
import { FormService } from '@/modules/form/services/form.service';
import { FormEventHandler } from '@/modules/form/services/form.event.handler';
import locale from 'element-ui/lib/locale/lang/en';
import ElementUI from 'element-ui';

Vue.use(ElementUI, { locale });
export default {
  name: 'EnForm',
  components: { Parser },
  props: {
    formConfig: {
      type: Object,
      default: () => {
        return {};
      }
    },
    modelAlias: {
      type: String,
      required: true
    },
    recordId: {
      type: String,
      default: 'new'
    },
    remote: {
      type: Boolean,
      default: true
    },
    actions: {
      type: Array,
      default: null
    },
    formId: {
      type: String,
      default: 'default'
    },
    controls: {
      type: Object,
      default: () => {
        return {
          tabs: []
        };
      }
    },
    record: () => {
      return {};
    }
  },
  data() {
    return {
      formService: null
    };
  },
  beforeCreate() {
    this.formEventHandler = new FormEventHandler(this);
  },
  created() {
    const formService = new FormService({
      formConfig: this.formConfig,
      remote: this.remote,
      modelAlias: this.modelAlias,
      formId: this.formId,
      recordId: this.recordId,
      controls: this.controls,
      record: this.record || {},
      actions: this.actions || []
    });
    formService.loadDefinition().then(() => {
      formService.refresh();
    });
    Vue.set(this, 'formService', formService);
  },
  methods: {
    submitForm() {

    }
  }
};
</script>

<style lang='scss'>
@import '../../../../modules/form/styles/home';
@import '../../../../modules/form/styles/index';
@import '../../../../modules/form/styles/mixin';
</style>
