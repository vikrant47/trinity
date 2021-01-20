import { WIDGETS } from '@/modules/form/components/widgets/base-widget/widgets';

export const ITEM_LAYOUT = {
  colFormItem: 'colFormItem',
  rowFormItem: 'rowFormItem'
};
export const DEFAULT_CONFIG_SECTION = {
  'fieldSettings.type': {
    widgetAlias: WIDGETS.select,
    fieldName: 'fieldSettings.type',
    fieldSettings: {
      placeholder: 'Please Select Type'
    },
    widgetSettings: {
      span: 24,
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
    /* fieldSettings: {
      disabled: '${widget.system===true}',
    },*/
    widgetSettings: {
      span: 24,
      label: 'Field',
      required: true,
      targetModel: 'engine_fields',
      key: 'name',
      displayField: 'label',
      where: {
        model: '${form.model}'
      }
    }
  },
  'widgetSettings.label': {
    fieldName: 'widgetSettings.label',
    widgetAlias: WIDGETS.input,
    widgetSettings: {
      span: 24,
      label: 'Label',
      required: true
    }
  },
  'fieldSettings.title': {
    fieldName: 'fieldSettings.title',
    widgetAlias: WIDGETS.input,
    widgetSettings: {
      span: 24,
      label: 'Title',
      required: false
    }
  },
  'fieldSettings.placeholder': {
    fieldName: 'fieldSettings.placeholder',
    widgetSettings: {
      span: 24,
      label: 'Placeholder'
    }
  },
  'fieldSettings.size': {
    fieldName: 'fieldSettings.size',
    widgetSettings: {
      span: 24,
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
      span: 24,
      label: 'Show Label',
      default: true
    }
  },
  'widgetSettings.labelWidth': {
    fieldName: 'widgetSettings.labelWidth',
    widgetAlias: WIDGETS.number,
    widgetSettings: {
      span: 24,
      defaultValue: '0',
      label: 'Label Width',
      min: 0
    }
  },
  'widgetSettings.span': {
    fieldName: 'widgetSettings.span',
    widgetAlias: WIDGETS.number,
    widgetSettings: {
      span: 24,
      label: 'Span',
      min: 0,
      max: 100
    }
  },
  'fieldSettings.icon': {
    fieldName: 'fieldSettings.icon',
    widgetAlias: WIDGETS.icon,
    widgetSettings: {
      span: 24,
      label: 'Icon'
    }
  },
  'fieldSettings.disabled': {
    widgetAlias: WIDGETS.switch,
    fieldName: 'fieldSettings.disabled',
    widgetSettings: {
      span: 24,
      label: 'Disabled',
      default: false
    }
  },
  'widgetSettings.required': {
    widgetAlias: WIDGETS.switch,
    fieldName: 'widgetSettings.required',
    widgetSettings: {
      span: 24,
      label: 'Required',
      default: false
    }
  },
  'widgetSettings.triggers': {
    fieldName: 'widgetSettings.triggers',
    widgetAlias: WIDGETS.codeEditor,
    widgetSettings: {
      advance: true,
      label: 'Triggers',
      language: 'javascript',
      parse: true,
    }
  }, 'widgetSettings.layout': {
    fieldName: 'widgetSettings.layout',
    widgetAlias: WIDGETS.select,
    fieldSettings: {
      span: 24,
      required: true,
      placeholder: 'Please Select Widget'
    },
    widgetSettings: {
      span: 24,
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
      span: 24,
      label: 'Default',
      required: false
    }
  },
  'fieldSettings.showWordLimit': {
    fieldName: 'fieldSettings.showWordLimit',
    widgetAlias: WIDGETS.switch,
    widgetSettings: {
      span: 24,
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
