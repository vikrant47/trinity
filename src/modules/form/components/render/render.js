import { deepClone } from '@/modules/form/utils';
import FormDesigner from '@/modules/form/components/widgets/form-designer/FormDesigner';

const widgets = {
  'form-designer': FormDesigner
};
const componentChild = {};
/**
 * Mount the files in ./slots to the object component Child
 * The file name is key, corresponding to __config__.tag in the JSON configuration
 * The content of the file is value, parse the __slot__ in the JSON configuration
 */
const slotsFiles = require.context('./slots', false, /\.js$/);
const keys = slotsFiles.keys() || [];
keys.forEach(key => {
  const tag = key.replace(/^\.\/(.*)\.\w+$/, '$1');
  const value = slotsFiles(key).default;
  componentChild[tag] = value;
});

function vModel(dataObject, defaultValue) {
  dataObject.props.value = defaultValue;

  dataObject.on.input = val => {
    this.$emit('input', val);
  };
}

function mountSlotFiles(h, confClone, children) {
  const childObjs = widgets[confClone.__config__.tag];
  if (childObjs) {
    Object.keys(childObjs).forEach(key => {
      const childFunc = childObjs[key];
      if (confClone.__slot__ && confClone.__slot__[key]) {
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
    if (key === '__vModel__') {
      vModel.call(this, dataObject, confClone.__config__.defaultValue);
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
  delete dataObject.attrs.__config__;
  delete dataObject.attrs.__slot__;
  delete dataObject.attrs.__methods__;
}

function makeDataObject() {
  // In-depth data objects:
  // https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1
  return {
    class: {},
    attrs: {},
    props: {},
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
}

export default {
  props: {
    conf: {
      type: Object,
      required: true
    }
  },
  render(h) {
    const dataObject = makeDataObject();
    const confClone = deepClone(this.conf);
    const children = this.$slots.default || [];

    // If a file with the same name as the current tag exists in the slots folder, the code in the file is executed
    mountSlotFiles.call(this, h, confClone, children);

    // send string events as messages
    emitEvents.call(this, confClone);

    // Convert json form configuration to vue recognizable by render "Data Object"
    buildDataObject.call(this, confClone, dataObject);
    const tag = this.conf.__config__.tag;
    return h(widgets[tag] || tag, dataObject, children);
  }
};
