<template>
  <div class="action-wrapper">
    <el-dropdown
      v-if="action.children && action.children.length > 0"
      :id="action.id"
      split-button
      :type="action.style.type"
      :children="action.children"
      :name="action.name"
      :icon="action.style.icon"
      :label="action.label"
      :shape="action.style.shape"
      :plain="action.style.plain"
      :loading="action.loading"
      :size="action.style.size"
      @click="process($event)"
      @command="handleChildAction"
    >
      {{ action.label }}
      <el-dropdown-menu
        v-for="child of action.children"
        :key="child.id"
        slot="dropdown"
      >
        <el-dropdown-item
          :command="child"
          :type="child.style.type"
          :children="child.children"
          :name="child.name"
          :icon="child.style.icon"
          :label="child.label"
          :shape="child.style.shape"
          :plain="child.style.plain"
          :loading="child.loading"
          :size="child.style.size"
          @click="process($event,child)"
        >{{ child.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-button
      v-if="!action.children || action.children.length===0"
      :id="action.id"
      :type="action.style.type"
      :children="action.children"
      :name="action.name"
      :icon="action.style.icon"
      :label="action.label"
      :shape="action.style.shape"
      :plain="action.style.plain"
      :loading="action.loading"
      :size="action.style.size"
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
    async handleChildAction(child) {
      return await this.process(null, child);
    },
    async process($event, action) {
      if (!action) {
        action = this.action;
      }
      this.loading = true;
      try {
        await action.execute(this.event, this.context);
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
