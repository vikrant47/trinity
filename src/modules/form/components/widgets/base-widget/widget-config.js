import { WIDGETS } from '@/modules/form/components/widgets/base-widget/widgets';
import _ from 'lodash';

export const ITEM_LAYOUT = {
  colFormItem: 'colFormItem',
  rowFormItem: 'rowFormItem'
};
export const DEFAULT_CONFIG_SECTION = [
  {
    widgetAlias: WIDGETS.select,
    fieldName: 'widgetAlias',
    fieldSettings: {
      placeholder: 'Please Select Widget'
    },
    widgetSettings: {
      label: 'Widget',
      widgetIcon: 'select',
      defaultValue: 'string',
      required: true
    },
    slot: {
      options: Object.keys(WIDGETS).map((widgetName) => {
        return {
          label: _.camelCase(WIDGETS[widgetName]),
          value: widgetName
        };
      })
    }
  }, {
    fieldName: 'fieldName',
    widgetSettings: {
      label: 'Name',
      required: true
    }
  }, {
    fieldName: 'fieldSettings.title',
    widgetAlias: WIDGETS.reference,
    widgetSettings: {
      label: 'Title',
      required: true
    }
  }, {
    fieldName: 'fieldSettings.placeholder',
    widgetSettings: {
      label: 'Placeholder'
    }
  },
  {
    fieldName: 'fieldSettings.size',
    widgetSettings: {
      label: 'Size'
    },
    widgetAlias: WIDGETS.select,
    slot: {
      options: [{
        label: 'Large', value: 'large'
      },
      {
        label: 'small', value: 'small'
      }]
    }
  },
  {
    fieldName: 'widgetSettings.showLabel',
    widgetAlias: WIDGETS.switch,
    widgetSettings: {
      label: 'Show Label',
      default: true
    }
  },
  {
    fieldName: 'widgetSettings.labelWidth',
    widgetAlias: WIDGETS.number,
    widgetSettings: {
      defaultValue: '0',
      label: 'Label Width',
      min: 0
    }
  },
  {
    fieldName: 'fieldSettings.span',
    widgetAlias: WIDGETS.number,
    widgetSettings: {
      label: 'Span',
      min: 0,
      max: 12
    }
  },
  {
    fieldName: 'fieldSettings.icon',
    widgetSettings: {
      label: 'Icon'
    }
  },
  {
    label: 'Required',
    widgetAlias: WIDGETS.switch,
    fieldName: 'fieldSettings.required',
    widgetSettings: {
      default: false
    }
  }, {
    fieldName: 'widgetSettings.layout',
    widgetAlias: WIDGETS.select,
    fieldSettings: {
      required: true,
      placeholder: 'Please Select Widget'
    },
    widgetSettings: {
      label: 'Layout',
      widgetIcon: 'select',
      defaultValue: ITEM_LAYOUT.colFormItem
    },
    slot: {
      options: [{
        'label': 'Column Layout',
        'value': ITEM_LAYOUT.colFormItem
      }, {
        'label': 'Row Layout',
        'value': ITEM_LAYOUT.rowFormItem
      }]
    }
  },
  {
    fieldName: 'widgetSettings.defaultValue',
    widgetSettings: {
      label: 'Default'
    }
  },
  {
    fieldName: 'fieldSettings.showWordLimit',
    widgetAlias: WIDGETS.switch,
    widgetSettings: {
      label: 'Show Limit'
    }
  }
];
