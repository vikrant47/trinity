<template>
  <editor
    ref="toastuiEditor"
    :initial-value="editorHtml"
    :options="editorOptions"
    :height="height"
    :initial-edit-type="editorType"
    :preview-style="previewStyle"
    @change="onEditorChange"
  />
</template>

<script>
import 'codemirror/lib/codemirror.css'; // Editor's Dependency Style
import '@toast-ui/editor/dist/toastui-editor.css'; // Editor's Style
import { Editor } from '@toast-ui/vue-editor';

export default {
  name: 'MarkDown',
  components: {
    editor: Editor
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    previewStyle: {
      type: String,
      default: 'vertical'
    },
    editorType: {
      type: String,
      default: 'wysiwyg'
    },
    height: {
      type: String,
      default: '300px'
    },
    options: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      editorText: this.value,
      editorOptions: this.options
    };
  },
  computed: {
    editorHtml: function() {
      return this.value;
    },
  },
  watch: {
    'value': {
      handler(value) {
        this.$refs.toastuiEditor.invoke('setHtml', value);
      },
      deep: true
    },
  },
  methods: {
    onEditorChange() {
      this.$emit('change', this.$refs.toastuiEditor.invoke('getHtml'));
    }
  }
};
</script>

<style scoped>
.text {
  text-align: left;
}

::v-deep .w-e-text-container {
  height: 420px !important;
}
</style>
