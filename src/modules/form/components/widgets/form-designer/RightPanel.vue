<script>
import { saveFormConf } from '@/modules/form/utils/db';
import widgets, { FormWidgetService } from '@/modules/form/components/widgets';
import Parser from '../../parser/Parser';
import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

// Make the change Render Key available when the target component changes

export default {
  name: 'RightPanel',
  components: {
    Parser
  },
  props: {
    showField: {
      type: Boolean
    },
    activeWidget: {
      type: Object,
      required: true
    },
    formConf: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      widgets,
      currentTab: 'field',
      currentNode: null,
      dialogVisible: false,
      iconsVisible: false,
      currentIconModel: null
    };
  },
  computed: {
    widgetConfigComponent() {
      const widget = widgets[this.activeWidget.widgetSettings.widget];
      const config = widget.config;
      if (typeof config === 'function') {
        return config();
      }
      return config;
    },
    documentLink() {
      return (
        this.activeWidget.widgetSettings.document ||
        'https://element.eleme.cn/#/zh-CN/component/installation'
      );
    }
  },
  watch: {
    formConf: {
      handler(val) {
        saveFormConf(val);
      },
      deep: true
    }
  },
  render(h) {
    const { currentTab, documentLink } = this;
    let { activeWidget } = this;
    if (!(activeWidget instanceof BaseWidget)) {
      activeWidget = new FormWidgetService().getWidgetInstance(activeWidget);
    }
    activeWidget.loadConfigForConfigSection();
    return <div class='right-board'>
      <el-tabs v-model={currentTab} class='center-tabs'>
        <el-tab-pane label='Component properties' name='field'/>
        <el-tab-pane label='Form attributes' name='form'/>
      </el-tabs>
      <div class='field-box'>
        <a class='document-link' target='_blank' href={documentLink} title='View component documentation'>
          <i class='el-icon-link'/>
        </a>
        <el-scrollbar class='right-scrollbar'>
          <div>Parsing alias - {activeWidget.widgetAlias}</div>
          {h(Parser, { props: { formData: activeWidget.fieldSettings, formConf: activeWidget.configSection }})}
        </el-scrollbar>
      </div>
    </div>;
  }
};
</script>

<style lang='scss' scoped>
.right-board {
  height: 100%;
  overflow: scroll;
  /*width: 350px;
  position: absolute;
  right: 0;
  top: 0;
  padding-top: 3px;*/
}

.field-box {
  position: relative;
  height: calc(100vh - 42px);
  box-sizing: border-box;
  overflow: hidden;
}

.el-scrollbar {
  height: 100%;
}

.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;

  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }

  & .el-input + .el-input {
    margin-left: 4px;
  }
}

.select-item + .select-item {
  margin-top: 4px;
}

.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}

.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}

.option-drag {
  cursor: move;
}

.time-range {
  .el-date-editor {
    width: 227px;
  }

  ::v-deep .el-icon-time {
    display: none;
  }
}

.document-link {
  position: absolute;
  display: block;
  width: 26px;
  height: 26px;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #409eff;
  z-index: 1;
  border-radius: 0 0 6px 0;
  text-align: center;
  line-height: 26px;
  color: #fff;
  font-size: 18px;
}

.node-label {
  font-size: 14px;
}

.node-icon {
  color: #bebfc3;
}
</style>
