<template>
  <div>
    <el-drawer v-bind="$attrs" v-on="$listeners" @opened="onOpen" @close="onClose">
      <div style="height:100%">
        <el-row style="height:100%;overflow:auto">
          <el-col :md="24" :lg="12" class="left-editor">
            <div class="setting" title="Resource reference" @click="showResource">
              <el-badge :is-dot="!!resources.length" class="item">
                <i class="el-icon-setting" />
              </el-badge>
            </div>
            <el-tabs v-model="activeTab" type="card" class="editor-tabs">
              <el-tab-pane name="html">
                <span slot="label">
                  <i v-if="activeTab==='html'" class="el-icon-edit" />
                  <i v-else class="el-icon-document" />
                  template
                </span>
              </el-tab-pane>
              <el-tab-pane name="js">
                <span slot="label">
                  <i v-if="activeTab==='js'" class="el-icon-edit" />
                  <i v-else class="el-icon-document" />
                  script
                </span>
              </el-tab-pane>
              <el-tab-pane name="css">
                <span slot="label">
                  <i v-if="activeTab==='css'" class="el-icon-edit" />
                  <i v-else class="el-icon-document" />
                  css
                </span>
              </el-tab-pane>
            </el-tabs>
            <div v-show="activeTab==='html'" id="editorHtml" class="tab-editor" />
            <div v-show="activeTab==='js'" id="editorJs" class="tab-editor" />
            <div v-show="activeTab==='css'" id="editorCss" class="tab-editor" />
          </el-col>
          <el-col :md="24" :lg="12" class="right-preview">
            <div class="action-bar" :style="{'text-align': 'left'}">
              <span class="bar-btn" @click="runCode">
                <i class="el-icon-refresh" />
                Refresh
              </span>
              <span class="bar-btn" @click="exportFile">
                <i class="el-icon-download" />
                Export vue file
              </span>
              <span ref="copyBtn" class="bar-btn copy-btn">
                <i class="el-icon-document-copy" />
                Copy code
              </span>
              <span class="bar-btn delete-btn" @click="$emit('update:visible', false)">
                <i class="el-icon-circle-close" />
                close
              </span>
            </div>
            <iframe
              v-show="isIframeLoaded"
              ref="previewPage"
              class="result-wrapper"
              frameborder="0"
              src="preview.html"
              @load="iframeLoad"
            />
            <div v-show="!isIframeLoaded" v-loading="true" class="result-wrapper" />
          </el-col>
        </el-row>
      </div>
    </el-drawer>
    <resource-dialog
      :visible.sync="resourceVisible"
      :origin-resource="resources"
      @save="setResource"
    />
  </div>
</template>
<script>
import { parse } from '@babel/parser';
import ClipboardJS from 'clipboard';
import { saveAs } from 'file-saver';
import {
  makeUpHtml, vueTemplate, vueScript, cssStyle
} from '@/modules/form/components/generator/html';
import { makeUpJs } from '@/modules/form/components/generator/js';
import { makeUpCss } from '@/modules/form/components/generator/css';
import { exportDefault, beautifierConf, titleCase } from '@/modules/form/utils';
import ResourceDialog from '../../../views/index/ResourceDialog';
import loadMonaco from '@/modules/form/utils/loadMonaco';
import loadBeautifier from '@/modules/form/utils/loadBeautifier';

const editorObj = {
  html: null,
  js: null,
  css: null
};
const mode = {
  html: 'html',
  js: 'javascript',
  css: 'css'
};
let beautifier;
let monaco;

export default {
  components: { ResourceDialog },
  props: ['formData', 'generateConf'],
  data() {
    return {
      activeTab: 'html',
      htmlCode: '',
      jsCode: '',
      cssCode: '',
      codeFrame: '',
      isIframeLoaded: false,
      isInitcode: false, // Ensure that the two asynchronous runcodes are executed only once after open
      isRefreshCode: false, // You need to refresh the code every time you open it
      resourceVisible: false,
      scripts: [],
      links: [],
      monaco: null
    };
  },
  computed: {
    resources() {
      return this.scripts.concat(this.links);
    }
  },
  watch: {},
  created() {
  },
  mounted() {
    window.addEventListener('keydown', this.preventDefaultSave);
    const clipboard = new ClipboardJS('.copy-btn', {
      text: trigger => {
        const codeStr = this.generateCode();
        this.$notify({
          title: 'success',
          message: 'The code has been copied to the clipboard and can be pasted.',
          type: 'success'
        });
        return codeStr;
      }
    });
    clipboard.on('error', e => {
      this.$message.error('Code copy failed');
    });
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.preventDefaultSave);
  },
  methods: {
    preventDefaultSave(e) {
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
      }
    },
    onOpen() {
      const { type } = this.generateConf;
      this.htmlCode = makeUpHtml(this.formData, type);
      this.jsCode = makeUpJs(this.formData, type);
      this.cssCode = makeUpCss(this.formData);

      loadBeautifier(btf => {
        beautifier = btf;
        this.htmlCode = beautifier.html(this.htmlCode, beautifierConf.html);
        this.jsCode = beautifier.js(this.jsCode, beautifierConf.js);
        this.cssCode = beautifier.css(this.cssCode, beautifierConf.html);

        loadMonaco(val => {
          monaco = val;
          this.setEditorValue('editorHtml', 'html', this.htmlCode);
          this.setEditorValue('editorJs', 'js', this.jsCode);
          this.setEditorValue('editorCss', 'css', this.cssCode);
          if (!this.isInitcode) {
            this.isRefreshCode = true;
            this.isIframeLoaded && (this.isInitcode = true) && this.runCode();
          }
        });
      });
    },
    onClose() {
      this.isInitcode = false;
      this.isRefreshCode = false;
    },
    iframeLoad() {
      if (!this.isInitcode) {
        this.isIframeLoaded = true;
        this.isRefreshCode && (this.isInitcode = true) && this.runCode();
      }
    },
    setEditorValue(id, type, codeStr) {
      if (editorObj[type]) {
        editorObj[type].setValue(codeStr);
      } else {
        editorObj[type] = monaco.editor.create(document.getElementById(id), {
          value: codeStr,
          theme: 'vs-dark',
          language: mode[type],
          automaticLayout: true
        });
      }
      // ctrl + s 刷新
      editorObj[type].onKeyDown(e => {
        if (e.keyCode === 49 && (e.metaKey || e.ctrlKey)) {
          this.runCode();
        }
      });
    },
    runCode() {
      const jsCodeStr = editorObj.js.getValue();
      try {
        const ast = parse(jsCodeStr, { sourceType: 'module' });
        const astBody = ast.program.body;
        if (astBody.length > 1) {
          this.$confirm(
            'The js format is not recognized, only supports modification of export default object content',
            'Prompt',
            {
              type: 'warning'
            }
          );
          return;
        }
        if (astBody[0].type === 'ExportDefaultDeclaration') {
          const postData = {
            type: 'refreshFrame',
            data: {
              generateConf: this.generateConf,
              html: editorObj.html.getValue(),
              js: jsCodeStr.replace(exportDefault, ''),
              css: editorObj.css.getValue(),
              scripts: this.scripts,
              links: this.links
            }
          };

          this.$refs.previewPage.contentWindow.postMessage(
            postData,
            location.origin
          );
        } else {
          this.$message.error('Please use export default');
        }
      } catch (err) {
        this.$message.error(`js error:${err}`);
        console.error(err);
      }
    },
    generateCode() {
      const html = vueTemplate(editorObj.html.getValue());
      const script = vueScript(editorObj.js.getValue());
      const css = cssStyle(editorObj.css.getValue());
      return beautifier.html(html + script + css, beautifierConf.html);
    },
    exportFile() {
      this.$prompt('file name:', 'Export file', {
        inputValue: `${+new Date()}.vue`,
        closeOnClickModal: false,
        inputPlaceholder: 'Please enter the file name'
      }).then(({ value }) => {
        if (!value) value = `${+new Date()}.vue`;
        const codeStr = this.generateCode();
        const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, value);
      });
    },
    showResource() {
      this.resourceVisible = true;
    },
    setResource(arr) {
      const scripts = [];
      const
        links = [];
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          if (item.endsWith('.css')) {
            links.push(item);
          } else {
            scripts.push(item);
          }
        });
        this.scripts = scripts;
        this.links = links;
      } else {
        this.scripts = [];
        this.links = [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../../styles/mixin';

.tab-editor {
  position: absolute;
  top: 33px;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 14px;
}

.left-editor {
  position: relative;
  height: 100%;
  background: #1e1e1e;
  overflow: hidden;
}

.setting {
  position: absolute;
  right: 15px;
  top: 3px;
  color: #a9f122;
  font-size: 18px;
  cursor: pointer;
  z-index: 1;
}

.right-preview {
  height: 100%;

  .result-wrapper {
    height: calc(100vh - 33px);
    width: 100%;
    overflow: auto;
    padding: 12px;
    box-sizing: border-box;
  }
}

@include action-bar;
::v-deep .el-drawer__header {
  display: none;
}
</style>
