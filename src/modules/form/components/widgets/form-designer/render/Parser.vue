<script>
import Render from '@/modules/form/components/widgets/form-designer/render/render.js';
import { Engine } from '@/modules/engine/core/engine';

const ruleTrigger = {
  'el-input': 'blur',
  'el-input-number': 'blur',
  'el-select': 'change',
  'el-radio-group': 'change',
  'el-checkbox-group': 'change',
  'el-cascader': 'change',
  'el-time-picker': 'change',
  'el-date-picker': 'change',
  'el-rate': 'change'
};

const layouts = {
  colFormItem(h, widget) {
    /* if (!(widget instanceof BaseWidget)) {
      widget = new FormWidgetService().getWidgetInstance(widget);
    }
    widget.setFormModel(this.formModel);*/
    const config = widget.widgetSettings;
    const listeners = buildListeners.call(this, widget);

    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null;
    if (config.showLabel === false) labelWidth = '0';
    return (
      <el-col span={config.span}>
        <el-form-item label-width={labelWidth} prop={widget.fieldName}
          label={config.showLabel ? config.label : ''} required={config.required}>
          <render widget={widget} {...{ on: listeners }} form-model={this.formData}/>
        </el-form-item>
      </el-col>
    );
  },
  rowFormItem(h, widget) {
    let child = renderChildren.apply(this, arguments);
    if (widget.type === 'flex') {
      child = <el-row type={widget.type} justify={widget.justify} align={widget.align}>
        {child}
      </el-row>;
    }
    return (
      <el-col span={widget.span}>
        <el-row gutter={widget.gutter}>
          {child}
        </el-row>
      </el-col>
    );
  }
};

function renderFrom(h) {
  const { formConf } = this;

  return (
    <el-row gutter={formConf.gutter}>
      <el-form
        size={formConf.size}
        label-position={formConf.labelPosition}
        disabled={formConf.disabled}
        label-width={`${formConf.labelWidth}px`}
        ref={formConf.formRef}
        // model cannot be assigned directly https://github.com/vuejs/jsx/issues/49#issuecomment-472013664
        props={{ model: this.formData }}
        rules={this[formConf.formRules]}
      >
        {renderFormItem.call(this, h, formConf.widgets, this.formModel)}
        {formConf.formBtns && formBtns.call(this, h)}
      </el-form>
    </el-row>
  );
}

function formBtns(h) {
  return <el-col>
    <el-form-item size='large'>
      <el-button type='primary' onClick={this.submitForm}>提交</el-button>
      <el-button onClick={this.resetForm}>Reset</el-button>
    </el-form-item>
  </el-col>;
}

function renderFormItem(h, elementList, formModel) {
  return elementList.map(widget => {
    const config = widget.widgetSettings;
    const layout = layouts[config.layout];

    if (layout) {
      return layout.call(this, h, widget, formModel);
    }
    throw new Error(`No layout fount with ${config.layout} name`);
  });
}

function renderChildren(h, widget) {
  const config = widget.widgetSettings;
  if (!Array.isArray(config.children)) return null;
  return renderFormItem.call(this, h, config.children);
}

function setValue(event, config, widget) {
  this.$set(config, 'defaultValue', event);
  this.$set(this.formData, widget.fieldName, event);
}

function buildListeners(widget) {
  const config = widget.widgetSettings;
  const methods = this.formConf.__methods__ || {};
  const listeners = {};

  // Bind this and event to the methods in __methods__
  Object.keys(methods).forEach(key => {
    listeners[key] = event => methods[key].call(this, event);
  });
  // response render.js Neutral vModel $emit('input', val)
  listeners.input = event => setValue.call(this, event, config, widget);

  return listeners;
}

export default {
  name: 'Parser',
  components: {
    Render
  },
  props: {
    formConf: {
      type: Object,
      required: true
    },
    formModel: {
      type: Object,
      required: true,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      formData: Engine.clone(this.formModel),
      widgetConf: this.formConf
    };
  },
  mounted() {
    if (!this.formConf.rules) {
      this.formConf.rules = {};
    }
    // this.initFormData(this.formConf.widgets, this.formData);
    this.buildRules(this.formConf.widgets, this.formConf.rules);
  },
  methods: {
    initFormData(widgets, formModel) {
      widgets.forEach(widget => {
        widget.setFormModel(this.formConf.model);
        const { widgetSettings } = widget;
        if (widget.fieldName && !formModel[widget.fieldName]) {
          formModel[widget.fieldName] = widgetSettings.defaultValue;
        }
        if (widgetSettings.children) {
          this.initFormData(widgetSettings.children, formModel);
        }
      });
    },
    buildRules(componentList, rules) {
      componentList.forEach(widget => {
        const config = widget.widgetSettings;
        if (Array.isArray(config.regList)) {
          if (config.required) {
            const required = { required: config.required, message: widget.placeholder };
            if (Array.isArray(config.defaultValue)) {
              required.type = 'array';
              required.message = `Please select at least one ${config.label}`;
            }
            required.message === undefined && (required.message = `${config.label} Can not be empty`);
            config.regList.push(required);
          }
          rules[widget.fieldName] = config.regList.map(item => {
            // eslint-disable-next-line no-eval
            item.pattern && (item.pattern = eval(item.pattern));
            item.trigger = ruleTrigger && ruleTrigger[config.widget];
            return item;
          });
        }
        if (config.children) this.buildRules(config.children, rules);
      });
    },
    resetForm() {
      // this.formConf = deepClone(this.formConf);
      this.$refs[this.formConf.formRef].resetFields();
    },
    submitForm() {
      this.$refs[this.formConf.formRef].validate(valid => {
        if (!valid) return false;
        // TriggerTheSubmitEvent
        this.$emit('submit', this[this.formModel]);
        return true;
      });
    }
  },
  render(h) {
    return renderFrom.call(this, h);
  }
};
</script>
