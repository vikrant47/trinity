import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

/*
function vModel(dataObject, defaultValue) {
  dataObject.props.value = typeof dataObject.props.value === 'undefined' ? defaultValue : dataObject.props.value;

  dataObject.on.input = val => {
    this.$emit('input', val);
  };
}

function mountSlotFiles(h, confClone, children) {
  const childObjs = widgets[confClone.widgetSettings.widget];
  if (childObjs) {
    Object.keys(childObjs).forEach(key => {
      const childFunc = childObjs[key];
      if (confClone.slot && confClone.slot[key]) {
        children.push(childFunc(h, confClone, key));
      }
    });
  }
}

function emitEvents(confClone) {
  ['on', 'nativeOn'].forEach(attr => {
    const eventKeyList = Object.keys(confClone[attr] || {});
    eventKeyList.forEach(key => {
      const val = confClone[attr][key];
      if (typeof val === 'string') {
        confClone[attr][key] = event => this.$emit(val, event);
      }
    });
  });
}

function buildDataObject(confClone, dataObject) {
  Object.keys(confClone).forEach(key => {
    const val = confClone[key];
    if (key === 'fieldName') {
      vModel.call(this, dataObject, confClone.widgetSettings.defaultValue);
    } else if (dataObject[key] !== undefined) {
      if (dataObject[key] === null ||
        dataObject[key] instanceof RegExp ||
        ['boolean', 'string', 'number', 'function'].includes(typeof dataObject[key])) {
        dataObject[key] = val;
      } else if (Array.isArray(dataObject[key])) {
        dataObject[key] = [...dataObject[key], ...val];
      } else {
        dataObject[key] = { ...dataObject[key], ...val };
      }
    } else {
      dataObject.attrs[key] = val;
    }
  });

  // Cleanup properties
  clearAttrs(dataObject);
}

function clearAttrs(dataObject) {
  delete dataObject.attrs.widgetSettings;
  delete dataObject.attrs.slot;
  delete dataObject.attrs.__methods__;
}

function makeDataObject() {
  // In-depth data objects:
  // https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1
  return {
    class: {},
    attrs: {},
    props: {
      value: this.formModel[this.conf.fieldName]
    },
    domProps: {},
    nativeOn: {},
    on: {},
    style: {},
    directives: [],
    scopedSlots: {},
    slot: null,
    key: null,
    ref: null,
    refInFor: true
  };
}*/

export default {
  name: 'Render',
  props: {
    widget: {
      type: BaseWidget,
      required: true
    },
    formModel: {
      type: Object,
      require: true
    },
    evalContext: {
      type: Object,
      default() {
        return {};
      }
    },
    wrapper: { // weather to create wrapper divs
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      flag: true,
      methods: this.widget.getMethods(),
      render: { key: new Date().getTime() }
    };
  },
  watch: {},
  async mounted() {
    this.widget.setRenderComponent(this);
    await this.widget.mounted();
  },
  render(h) {
    this.widget.setRenderComponent(this);
    // const formModel = Engine.clone(this.formModel);
    this.widget.setEvalContext(this.evalContext);
    this.widget.setFormModel(this.formModel);
    this.widget.beforeRender();
    let template = null;
    if (this.widget.designMode !== true) {
      template = h('el-col', this.widget.getWrapperConfig(), [
        h('el-form-item', this.widget.getFormItemConfig(), [
          this.widget.renderWidget(this, h)
        ])
      ]);
    } else {
      template = this.widget.renderWidget(this, h);
    }
    this.widget.afterRender();
    return template;
  }
};
