<script>
import { saveFormConf } from '@/modules/form/utils/db';
import Parser from '../render/Parser';
import { FormWidgetService } from '@/modules/form/services/form.widget.service';
import { EngineForm } from '@/modules/form/engine-api/engine.form';
// Make the change Render Key available when the target component changes
import { Engine } from '@/modules/engine/core/engine';
import { debounce } from '@/utils';

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
      currentTab: 'advance',
      currentNode: null,
      dialogVisible: false,
      iconsVisible: false,
      currentIconModel: null,
      formModel: this.activeWidget
    };
  },
  computed: {
    documentLink() {
      return (
        this.activeWidget.widgetSettings.document ||
        'https://element.eleme.cn/#/zh-CN/component/installation'
      );
    }
  },
  watch: {
    'formModel': {
      handler(model) {
        debounce(() => { // intended delay
          for (const key in model) {
            this.$set(this.activeWidget, key, model[key]);
          }
        }, 500);
      },
      deep: true
    },
    formConf: {
      handler(val) {
        saveFormConf(val);
      },
      deep: true
    }
  },
  mounted() {

  },
  methods: {
    handleTabClick(tab, event) {

    }
  },
  render(createElement) {
    // const activeWidget = new FormWidgetService().getWidgetInstance(this.activeWidget);
    const activeWidget = new FormWidgetService().getWidgetInstance(this.activeWidget);
    activeWidget.loadConfigForConfigSection();
    const widgetConfigForm = new EngineForm();
    widgetConfigForm.setFormConfig(activeWidget.loadBasicConfigSection());
    widgetConfigForm.setRecord(this.formModel);
    const advanceConfigForm = new EngineForm();
    advanceConfigForm.setFormConfig(activeWidget.loadAdvanceConfigSection());
    advanceConfigForm.setRecord(this.formModel);
    /* const formConfigForm = new EngineForm();
    formConfigForm.setFormConfig({
      labelSuffix: '',
      labelWidth: '100',
      labelPosition: 'right',
      widgets: DEFAULT_FORM_CONFIG.map(conf => new FormWidgetService().getWidgetInstance(
        Object.assign({
          widgetAlias: 'input'
        }, conf)))
    });
    formConfigForm.setRecord(activeWidget.configSection);*/
    const evalContext = { activeWidget: Engine.clone(activeWidget) };
    return <div class='right-board'>
      <el-tabs v-model={this.currentTab} class='center-tabs'>
        <el-tab-pane label='Component properties' name='field'>
          <div className='field-box'>
            <el-scrollbar className='right-scrollbar'>
              {createElement(Parser, { props: { engineForm: widgetConfigForm, evalContext: evalContext }})}
            </el-scrollbar>
          </div>
        </el-tab-pane>
        <el-tab-pane label='Advance' name='advance'>
          <div className='field-box'>
            <el-scrollbar className='right-scrollbar'>
              {createElement(Parser, { props: { engineForm: advanceConfigForm, evalContext: evalContext }})}
            </el-scrollbar>
          </div>
        </el-tab-pane>
        <el-tab-pane label='Form attributes' name='form'>
          <div className='field-box'>
            <el-scrollbar className='right-scrollbar'>
              {/* createElement(Parser, { props: { engineForm: formConfigForm, evalContext: { evalContext: evalContext }}})*/}
            </el-scrollbar>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>;
  }
};
</script>

<style lang='scss' scoped>

.right-board {
  height: 100%;
  overflow: hidden;
  /*width: 350px;
  position: absolute;
  right: 0;
  top: 0;
  padding-top: 3px;*/
  .el-tab {
    margin-bottom: 10px;
  }

  .el-form-item__content {
    display: flex;
  }

  .el-form-item--small {
    display: flex;
  }
}

</style>
