<template>
  <div class="form-container">
    <div class="head-container">
      <en-form-toolbar v-if="toolbar" :actions="engineForm.actions" />
    </div>
    <div class="form-parser">
      <parser
        :key="engineForm.hashCode"
        :engine-form="engineForm"
        @submit="submitForm"
      />
    </div>
  </div>
</template>

<script>

import Vue from 'vue';
import Parser from '@/modules/form/components/widgets/form-designer/render/Parser';
import { EngineForm } from '@/modules/form/engine-api/engine.form';
import { FormEventHandler } from '@/modules/form/services/form.event.handler';
import locale from 'element-ui/lib/locale/lang/en';
import ElementUI from 'element-ui';
import EnFormToolbar from '@/modules/form/components/engine/toolbar/EnFormToolbar';
import { FORM_EVENTS, FormEvent } from '@/modules/form/engine-api/form-events';

Vue.use(ElementUI, { locale });
export default {
  name: 'EnForm',
  components: { EnFormToolbar, Parser },
  props: {
    toolbar: {
      type: Boolean,
      default: false
    },
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
    record: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      engineForm: new EngineForm({
        formConfig: this.formConfig,
        remote: this.remote,
        modelAlias: this.modelAlias,
        formId: this.formId,
        recordId: this.recordId,
        controls: this.controls,
        record: this.record || {},
        actions: this.actions || []
      })
    };
  },
  beforeCreate() {
    this.formEventHandler = new FormEventHandler(this);
  },
  async mounted() {
    await this.engineForm.loadDefinition();
    if (!this.engineForm.isNew()) {
      await this.engineForm.refresh();
    } else {
      this.engineForm.setRecord({});
    }
    await this.engineForm.triggerProcessors(new FormEvent(FORM_EVENTS.form.afterRender), {});
  },
  beforeDestroy() {
    this.engineForm.triggerProcessors(new FormEvent(FORM_EVENTS.form.beforeDestroy), {});
  },
  updated() {
    this.engineForm.triggerProcessors(new FormEvent(FORM_EVENTS.form.beforeRender), {});
  },
  methods: {
    submitForm() {

    }
  }
};
</script>

<style lang='scss'>
@import '../../../styles/home';
@import '../../../styles/index';
@import '../../../styles/mixin';
</style>
