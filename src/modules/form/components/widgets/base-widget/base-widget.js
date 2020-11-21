import { ITEM_LAYOUT } from '@/modules/form/components/widgets/base-widget/widget-config';

export class BaseWidget {
  getConfig() {
    return [
      {
        fieldName: 'type',
        component: {
          label: 'Widget',
          tag: 'el-select',
          tagIcon: 'select',
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
          tag: 'el-slider'
        },
        min: 0,
        max: 10
      },
      {
        fieldName: 'showLabel',
        component: {
          label: 'Show Label',
          tag: 'el-switch'
        },
        default: true
      },
      {
        fieldName: 'labelWidth',
        component: {
          label: 'Label Width',
          tag: 'el-input-number'
        },
        min: 0
      },
      {
        fieldName: 'span',
        component: {
          label: 'Span',
          tag: 'el-input-number'
        },
        min: 0,
        max: 12
      },
      {
        fieldName: 'tagIcon',
        component: {
          label: 'Icon'
        }
      },
      {
        fieldName: 'tagIcon',
        component: {
          label: 'Icon'
        }
      },
      {
        fieldName: 'required',
        component: {
          label: 'Required',
          tag: 'el-switch'
        },
        default: false
      }, {
        fieldName: 'layout',
        component: {
          label: 'Layout',
          tag: 'el-select',
          tagIcon: 'select',
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
          tag: 'el-switch'
        }
      }
    ];
  }

  getData() {
    return {};
  }

  getComponent() {
    return 'string';
  }
}
