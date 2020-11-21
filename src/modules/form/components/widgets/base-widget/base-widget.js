import { ITEM_LAYOUT } from '@/modules/form/components/widgets/base-widget/widget-config';
import { WIDGETS } from '@/modules/form/components/widgets';

export class BaseWidget {
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
}
