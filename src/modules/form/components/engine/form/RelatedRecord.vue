<template>
  <div class="related-records">
    <el-tabs type="border-card" @tab-click="tabClick($event)">
      <el-tab-pane
        v-for="(item) in relatedRecords"
        :key="item.id"
        class="related-record-item"
        :label="item.label"
      >
        <div v-if="item.type==='list'" class="related-record-list">
          <en-list
            ref="items"
            :model-alias="item.referenced_model_alias"
            :lazy="true"
            :pagination="{}"
            :toolbar="true"
            :list="item.referenced_list_id"
            :remote="true"
            @mounted="listMounted($event,item)"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { EngineForm } from '@/modules/form/engine-api/engine.form';
import EnList from '@/modules/list/components/list/EnList';
import { FORM_EVENTS } from '@/modules/form/engine-api/form-events';

export default {
  name: 'RelatedRecord',
  components: { EnList },
  props: {
    engineForm: {
      type: EngineForm,
      require: true,
      default: null
    }
  },
  data() {
    return {
      relatedRecords: [],
      initialized: false
    };
  },
  mounted() {
    this.engineForm.on(FORM_EVENTS.model.fetch, () => { // related records must be rendered after data fetch
      this.relatedRecords = this.engineForm.getRelatedRecords();
    });
  },
  updated() {
    if (!this.initialized && this.relatedRecords.length > 0) {
      this.$refs.items[0].loadList();
      this.initialized = true;
    }
  },
  methods: {
    tabClick(tab) {
      this.$refs.items[tab.index].loadList();
    },
    async listMounted(list, relatedRecord) {
      // await this.engineForm.waitFor(FORM_EVENTS.model.fetch);
      const referencedField = relatedRecord.ref_referenced_field_id;
      list.setCondition({ [relatedRecord.referenced_field_name]: this.engineForm.getValue(referencedField.referenced_field_name) });
      // list.setCondition({ [relatedRecord.referenced_field_name]: form.getValue() });
    }
  }
};
</script>

<style scoped>

</style>
