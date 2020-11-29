<script>
import { deepClone } from '@/modules/form/utils';
import FormItemRenderer from '@/modules/form/components/render/render.js';
import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import { FormWidgetService } from '@/modules/form/components/widgets';

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
  colFormItem(h, widget, formData) {
    if (!(widget instanceof BaseWidget)) {
      widget = new FormWidgetService().getWidgetInstance(widget);
    }
    const config = widget.widgetSettings;
    const listeners = buildListeners.call(this, widget);

    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null;
    if (config.showLabel === false) labelWidth = '0';
    return (
      <el-col span={config.span}>
        <el-form-item label-width={labelWidth} prop={widget.fieldName}
          label={config.showLabel ? config.label : ''} required={config.required}>
          <form-item-renderer widget={widget} {...{ on: listeners }} form-model={formData}/>
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
  const { formConfCopy } = this;

  return (
    <el-row gutter={formConfCopy.gutter}>
      <el-form
        size={formConfCopy.size}
        label-position={formConfCopy.labelPosition}
        disabled={formConfCopy.disabled}
        label-width={`${formConfCopy.labelWidth}px`}
        ref={formConfCopy.formRef}
        // model cannot be assigned directly https://github.com/vuejs/jsx/issues/49#issuecomment-472013664
        props={{ model: this[formConfCopy.formModel] }}
        rules={this[formConfCopy.formRules]}
      >
        {renderFormItem.call(this, h, formConfCopy.widgets, this[formConfCopy.formModel])}
        {formConfCopy.formBtns && formBtns.call(this, h)}
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

function renderFormItem(h, elementList, formData) {
  return elementList.map(widget => {
    const config = widget.widgetSettings;
    const layout = layouts[config.layout];

    if (layout) {
      return layout.call(this, h, widget, formData);
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
  this.$set(this[this.formConf.formModel], widget.fieldName, event);
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
    FormItemRenderer
  },
  props: {
    formConf: {
      type: Object,
      required: true
    },
    formData: {
      type: Object,
      required: true,
      default() {
        return {};
      }
    }
  },
  data() {
    const data = {
      formConfCopy: this.formConf,
      [this.formConf.formModel]: this.formData,
      [this.formConf.formRules]: {}
    };
    this.initFormData(data.formConfCopy.widgets, data[this.formConf.formModel]);
    this.buildRules(data.formConfCopy.widgets, data[this.formConf.formRules]);
    return data;
  },
  methods: {
    initFormData(componentList, formData) {
      componentList.forEach(widget => {
        if (!(widget instanceof BaseWidget)) {
          widget = new FormWidgetService().getWidgetInstance(widget);
        }
        const { widgetSettings } = widget;
        if (widget.fieldName && !formData[widget.fieldName]) formData[widget.fieldName] = widgetSettings.defaultValue;
        if (widgetSettings.children) this.initFormData(widgetSettings.children, formData);
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
              required.message = `Please select at least one${config.label}`;
            }
            required.message === undefined && (required.message = `${config.label}Can not be empty`);
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
      // this.formConfCopy = deepClone(this.formConf);
      this.$refs[this.formConf.formRef].resetFields();
    },
    submitForm() {
      this.$refs[this.formConf.formRef].validate(valid => {
        if (!valid) return false;
        // TriggerTheSubmitEvent
        this.$emit('submit', this[this.formConf.formModel]);
        return true;
      });
    }
  },
  render(h) {
    return renderFrom.call(this, h);
  }
};
</script>
