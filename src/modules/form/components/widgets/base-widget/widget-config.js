export const ITEM_LAYOUT = {
  colFormItem: 'colFormItem',
  rowFormItem: 'rowFormItem'
};

export class SlotConfig {
  'prepend' = '';
  'append' = '';
  options = [];

  constructor(settings = {}) {
    Object.assign(this, settings);
  }
}

export class ComponentConfig {
  tag = 'el-input';
  span: 24;
  label: String;
  formId: String;
  layout: ITEM_LAYOUT.colFormItem;
  regList: [];
  tagIcon: 'date';
  document: null;
  required: true;
  changeTag: true;
  renderKey: String;
  showLabel: true;
  labelWidth: null;
  defaultValue: null;

  constructor(settings = {}) {
    Object.assign(this, settings);
  }
}

export class WidgetConfig {
  type: String;
  style = {
    width: '100%'
  };
  disabled: false;
  readonly: false;
  clearable: true;
  slot: SlotConfig;
  component: ComponentConfig;
  fieldName: String;
  placeholder: String;
  Name: String;
  filterable: true;
  min = null;
  max = null;
  step = 1;
  showStops = false;
  range: false;
  multiple = false;
  autosize = {
    minRows: 4,
    maxRows: 4
  };
  showWordLimit = true;

  constructor(settings = {}) {
    this.placeholder = 'Enter ' + settings.component.label ?? 'Value';
    Object.assign(this, settings);
    this.component = new ComponentConfig(settings.component);
    this.slot = new ComponentConfig(settings.slot);
  }
}
