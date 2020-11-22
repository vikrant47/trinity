import { ITEM_LAYOUT, WidgetConfig } from '@/modules/form/components/widgets/base-widget/widget-config';
import { WIDGETS } from '@/modules/form/components/widgets';

export class BaseWidget {
  formModel;
  children = [];
  settings = {
    fieldName: null,
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

  /** @property model: WidgetModel*/
  constructor(settings = {}) {
    Object.assign(this.settings, settings);
    this.init();
  }

  init() {
    if (typeof this.formModel[this.settings.fieldName] === 'undefined') {
      this.setValue(this.settings.defaultValue);
    }
  }

  setFieldName(fieldName) {
    this.fieldName = fieldName;
  }

  setFormModel(formModel) {
    this.formModel = formModel;
  }

  getValue() {
    return this.formModel[this.settings.fieldName];
  }

  setValue(value) {
    this.formModel[this.settings.fieldName] = value;
  }

  getConfig() {
    return [
      {
        fieldName: 'type',
        component: {
          label: 'Widget',
          widget: WIDGETS.select,
          widgetIcon: 'select',
          defaultValue: 'string',
          required: true
        },
        slot: {
          options: []
        },
        placeholder: 'Please Select Widget'
      }, {
        fieldName: 'name',
        component: {
          label: 'Name',
          required: true
        }
      }, {
        fieldName: 'title',
        component: {
          label: 'Title',
          required: true
        }
      }, {
        fieldName: 'placeholder',
        component: {
          label: 'Placeholder'
        }
      },
      {
        fieldName: 'size',
        component: {
          label: 'Size',
          widget: WIDGETS.slider
        },
        min: 0,
        max: 10
      },
      {
        fieldName: 'showLabel',
        component: {
          label: 'Show Label',
          widget: WIDGETS.switch
        },
        default: true
      },
      {
        fieldName: 'labelWidth',
        component: {
          label: 'Label Width',
          widget: WIDGETS.number
        },
        min: 0
      },
      {
        fieldName: 'span',
        component: {
          label: 'Span',
          widget: WIDGETS.number
        },
        min: 0,
        max: 12
      },
      {
        fieldName: 'widgetIcon',
        component: {
          label: 'Icon'
        }
      },
      {
        fieldName: 'required',
        component: {
          label: 'Required',
          widget: WIDGETS.switch
        },
        default: false
      }, {
        fieldName: 'layout',
        component: {
          label: 'Layout',
          widget: WIDGETS.select,
          widgetIcon: 'select',
          defaultValue: ITEM_LAYOUT.colFormItem,
          required: true
        },
        slot: {
          options: [{
            'label': 'Column Layout',
            'value': ITEM_LAYOUT.colFormItem
          }, {
            'label': 'Row Layout',
            'value': ITEM_LAYOUT.rowFormItem
          }]
        },
        placeholder: 'Please Select Widget'
      },
      {
        fieldName: 'defaultValue',
        component: {
          label: 'Default'
        }
      },
      {
        fieldName: 'showWordLimit',
        component: {
          label: 'Show Limit',
          widget: WIDGETS.switch
        }
      }
    ];
  }

  getSection() {
    return 'Primary';
  }

  getData() {
    return {};
  }

  getComponent() {
    return 'el-input';
  }

  registerEvents() {

  }

  updateModel() {

  }

  getChildren() {
    return this;
  }

  toVueConfig() {
    this.settings.name = this.settings.fieldName;
    return this.settings;
  }

  applyConfig(widgetConfig) {
    Object.assign(this.settings, widgetConfig);
    this.init();
  }

  componentCreated(component) {
    component.widget.applyConfig(component.config);
  }

  componentRender(component, h) {
    h(this.getComponent(), this.toVueConfig(), this.getChildren());
  }

  /** This method will return cue component object*/
  getVueComponent() {
    const _this = this;
    return {
      name: this.constructor.name,
      props: {
        config: {
          type: Object,
          required: true,
          default() {
            return {};
          }
        }
      },
      data: {
        widget() {
          return _this;
        }
      },
      created() {
        _this.componentCreated(this);
      },
      render(h) {
        _this.render(this, h);
      }
    };
  }
}
