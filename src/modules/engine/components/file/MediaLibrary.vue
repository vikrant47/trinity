<template>
  <div class="file-explorer-wrapper">
    <el-row :gutter="24">
      <el-col v-for="file in files" :key="file.id" :span="6">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="file|media" class="image">
          <div style="padding: 14px;">
            <span>{{ file.label }}</span>
            <div class="bottom clearfix">
              <div class="description">{{ file.description }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { EngineFileService } from '@/modules/engine/services/engine.file.service';

export default {
  name: 'EnMediaLibrary',
  props: {
    rootFolder: {
      type: String,
      default: process.env.ROOT_FOLDER_ID
    }
  },
  data() {
    return {
      folder: this.rootFolder,
      files: []
    };
  },
  created() {
  },
  async mounted() {
    const result = await new EngineFileService(this.rootFolder).listFiles();
    this.files = result.contents;
  },
  methods: {}
};
</script>

<style scoped>

</style>
