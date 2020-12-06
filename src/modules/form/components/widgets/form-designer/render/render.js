import { Engine } from '@/modules/engine/core/engine';
import { FormWidgetService } from '@/modules/form/services/form.widget.service';
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
      type: Object,
      required: true
    },
    formModel: {
      type: Object,
      require: true
    }
  },
  watch: {},
  render(h) {
    const widget = new FormWidgetService().getWidgetInstance(this.widget);
    widget.setFormModel(Engine.clone(this.formModel));
    return widget.componentRender(this, h);
  }
};
