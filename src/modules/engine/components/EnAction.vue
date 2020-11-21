<template>
  <div class="action-wrapper">
    <el-dropdown v-if="children.length > 0">
      <el-button
        :id="id"
        :type="type"
        :children="children"
        :name="name"
        :icon="icon"
        :label="label"
        :shape="shape"
        :plain="plain"
        :loading="spinner"
        :size="size"
        @click="process($event)"
      >{{ label }}
      </el-button>
      <el-dropdown-menu
        v-for="child of children"
        :key="child.id"
        slot="dropdown"
      >
        <en-action
          :id="child.id"
          shape="square"
          :type="child.type"
          :children="child.children"
          :name="child.name"
          :icon="child.icon"
          :label="child.label"
          :plain="child.plain"
          :processor="child.processor"
          :context="context"
          :loading="child.loading"
          :size="child.size"
        >{{ label }}
        </en-action>
      </el-dropdown-menu>
    </el-dropdown>
    <el-button
      v-if="children.length===0"
      :id="id"
      :type="type"
      :children="children"
      :name="name"
      :icon="icon"
      :label="label"
      :shape="shape"
      :loading="spinner"
      :size="size"
      @click="process($event)"
    >{{ label }}
    </el-button>
  </div>
</template>

<script>

import { EventProcessor } from '@/modules/engine/core/event.processor';

export default {
  name: 'EnAction',
  props: {
    id: {
      type: String,
      require: true,
      default: null
    },
    label: {
      type: String,
      require: true,
      default: null
    },
    name: {
      type: String,
      require: true,
      default: null
    },
    shape: {
      type: String,
      default: 'plain'
    },
    size: {
      type: String,
      default: 'small'
    },
    icon: {
      type: String,
      default: 'el-icon-check'
    },
    type: {
      type: String,
      default: 'default'
    },
    plain: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    hasParent: {
      type: Boolean,
      default: false
    },
    children: {
      type: Array,
      default() {
        return [];
      }
    },
    processor: {
      type: String,
      default: '()=>{}'
    },
    context: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      spinner: false
    };
  },
  created() {
    if (this.type.indexOf('plain') > -1) {
      this.type = this.type.replaceAll('plain', '');
      this.plain = true;
    }
    this.spinner = this.loading;
  },
  methods: {
    async process($event) {
      this.spinner = true;
      try {
        const processor = new EventProcessor({ handler: this.processor });
        await processor.process($event, this.context);
      } catch (e) {
        console.error('Error while processing action handler ', e, { context: this.context });
      } finally {
        this.spinner = false;
      }
    }
  }
};
</script>

<style scoped>

</style>
