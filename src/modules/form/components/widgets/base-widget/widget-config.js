import { WIDGETS } from '@/modules/form/components/widgets/base-widget/widgets';

export const ITEM_LAYOUT = {
  colFormItem: 'colFormItem',
  rowFormItem: 'rowFormItem'
};
export const DEFAULT_CONFIG_SECTION = [
  {
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
  }, {
    fieldName: 'fieldName',
    widgetAlias: WIDGETS.reference,
    widgetSettings: {
      label: 'Name',
      required: true,
      targetModel: 'engine_fields',
      key: 'id',
      displayField: 'name',
      where: {
        model: '${form.model}'
      }
    }
  }, {
    fieldName: 'widgetSettings.label',
    widgetAlias: WIDGETS.input,
    widgetSettings: {
      label: 'Label',
      required: true
    }
  }, {
    fieldName: 'fieldSettings.title',
    widgetAlias: WIDGETS.input,
    widgetSettings: {
      label: 'Title',
      required: false
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
    fieldName: 'widgetSettings.span',
    widgetAlias: WIDGETS.number,
    widgetSettings: {
      label: 'Span',
      min: 0,
      max: 100
    }
  },
  {
    fieldName: 'fieldSettings.icon',
    widgetAlias: WIDGETS.icon,
    widgetSettings: {
      label: 'Icon'
    }
  },
  {
    widgetAlias: WIDGETS.switch,
    fieldName: 'fieldSettings.disabled',
    widgetSettings: {
      label: 'Disabled',
      default: false
    }
  },
  {
    widgetAlias: WIDGETS.switch,
    fieldName: 'widgetSettings.required',
    widgetSettings: {
      label: 'Required',
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
      label: 'Default',
      required: false
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
