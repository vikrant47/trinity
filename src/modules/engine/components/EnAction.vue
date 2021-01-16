<template>
  <div class="action-wrapper">
    <el-dropdown v-if="action.children.length > 0">
      <el-button
        :id="action.id"
        :type="action.type"
        :children="action.children"
        :name="action.name"
        :icon="action.icon"
        :label="action.label"
        :shape="action.shape"
        :plain="action.plain"
        :loading="action.loading"
        :size="action.size"
        @click="process($event)"
      >{{ action.label }}
      </el-button>
      <el-dropdown-menu
        v-for="child of action.children"
        :key="child.id"
        slot="dropdown"
      >
        <en-action
          :action="child"
          :context="context"
        >{{ child.label }}
        </en-action>
      </el-dropdown-menu>
    </el-dropdown>
    <el-button
      v-if="action.children.length===0"
      :id="action.id"
      :type="action.type"
      :children="action.children"
      :name="action.name"
      :icon="action.icon"
      :label="action.label"
      :shape="action.shape"
      :loading="action.loading"
      :size="action.size"
      @click="process($event)"
    >{{ action.label }}
    </el-button>
  </div>
</template>

<script>

import { EngineAction } from '@/modules/engine/core/engine.action';

export default {
  name: 'EnAction',
  props: {
    action: {
      type: EngineAction,
      default() {
        return new EngineAction();
      }
    },
    event: {
      type: Object,
      default: () => {
        return {};
      }
    },
    context: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  created() {
  },
  methods: {
    async process($event) {
      this.loading = true;
      try {
        await this.action.execute(this.event, this.context);
      } catch (e) {
        console.error('Error while processing action handler ', e, { context: this.context });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>

</style>
