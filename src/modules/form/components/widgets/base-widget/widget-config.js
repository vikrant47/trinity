import { WIDGETS } from '@/modules/form/components/widgets/base-widget/widgets';

export const ITEM_LAYOUT = {
  colFormItem: 'colFormItem',
  rowFormItem: 'rowFormItem'
};
export const DEFAULT_CONFIG_SECTION = {
  type: {
    widgetAlias: WIDGETS.select,
    fieldName: 'type',
    fieldSettings: {
      placeholder: 'Please Select Type'
    },
    widgetSettings: {
      label: 'Type',
      widgetIcon: 'select',
      defaultValue: 'text',
      required: true,
      triggers: [{
        action: 'show',
        condition: '${activeWidget.widgetAlias===\'input\'}'
      }],
      visible: false
    },
    slot: {
      options: [{
        label: 'Single Line Text',
        value: 'text'
      }, {
        label: 'Multiline Text',
        value: 'textarea'
      }, {
        label: 'Password',
        value: 'password'
      }]
    }
  },
  fieldName: {
    fieldName: 'fieldName',
    widgetAlias: WIDGETS.reference,
    widgetSettings: {
      label: 'Name',
      required: true,
      targetModel: 'engine_fields',
      key: 'code',
      displayField: 'name',
      where: {
        model: '${form.model}'
      }
    }
  },
  'widgetSettings.label': {
    fieldName: 'widgetSettings.label',
    widgetAlias: WIDGETS.input,
    widgetSettings: {
      label: 'Label',
      required: true
    }
  },
  'fieldSettings.title': {
    fieldName: 'fieldSettings.title',
    widgetAlias: WIDGETS.input,
    widgetSettings: {
      label: 'Title',
      required: false
    }
  },
  'fieldSettings.placeholder': {
    fieldName: 'fieldSettings.placeholder',
    widgetSettings: {
      label: 'Placeholder'
    }
  },
  'fieldSettings.size': {
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
  'widgetSettings.showLabel': {
    fieldName: 'widgetSettings.showLabel',
    widgetAlias: WIDGETS.switch,
    widgetSettings: {
      label: 'Show Label',
      default: true
    }
  },
  'widgetSettings.labelWidth': {
    fieldName: 'widgetSettings.labelWidth',
    widgetAlias: WIDGETS.number,
    widgetSettings: {
      defaultValue: '0',
      label: 'Label Width',
      min: 0
    }
  },
  'widgetSettings.span': {
    fieldName: 'widgetSettings.span',
    widgetAlias: WIDGETS.number,
    widgetSettings: {
      label: 'Span',
      min: 0,
      max: 100
    }
  },
  'fieldSettings.icon': {
    fieldName: 'fieldSettings.icon',
    widgetAlias: WIDGETS.icon,
    widgetSettings: {
      label: 'Icon'
    }
  },
  'fieldSettings.disabled': {
    widgetAlias: WIDGETS.switch,
    fieldName: 'fieldSettings.disabled',
    widgetSettings: {
      label: 'Disabled',
      default: false
    }
  },
  'widgetSettings.required': {
    widgetAlias: WIDGETS.switch,
    fieldName: 'widgetSettings.required',
    widgetSettings: {
      label: 'Required',
      default: false
    }
  }, 'widgetSettings.layout': {
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
  'widgetSettings.defaultValue': {
    fieldName: 'widgetSettings.defaultValue',
    widgetSettings: {
      label: 'Default',
      required: false
    }
  },
  'fieldSettings.showWordLimit': {
    fieldName: 'fieldSettings.showWordLimit',
    widgetAlias: WIDGETS.switch,
    widgetSettings: {
      label: 'Show Limit'
    }
  }
};
export const DEFAULT_FORM_CONFIG = [{
  fieldName: 'labelSuffix',
  widgetSettings: {
    label: 'Label Suffix',
    required: true
  }
}, {
  widgetAlias: WIDGETS.number,
  fieldName: 'labelWidth',
  widgetSettings: {
    label: 'Label Width',
    required: true
  }
}, {
  fieldName: 'labelPosition',
  widgetSettings: {
    label: 'Label Position'
  },
  widgetAlias: WIDGETS.select,
  slot: {
    options: [{
      label: 'Left', value: 'left'
    }, {
      label: 'Right', value: 'right'
    }, {
      label: 'Top', value: 'top'
    }]
  }
}];
