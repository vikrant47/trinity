import InputConfig from '@/modules/form/components/widgets/input/Config';
import ButtonConfig from '@/modules/form/components/widgets/button/Config';
import CascaderConfig from '@/modules/form/components/widgets/cascader/Config';
import CheckboxConfig from '@/modules/form/components/widgets/checkbox-group/Config';
import ColorPickerConfig from '@/modules/form/components/widgets/color-picker/Config';
import FormDesignerConfig from '@/modules/form/components/widgets/form-designer/Config';
import NumberConfig from '@/modules/form/components/widgets/number/Config';
import SelectConfig from '@/modules/form/components/widgets/select/Config';

export default {
  'el-input': {
    config: InputConfig
  },
  'el-button': {
    config: ButtonConfig
  },
  'el-cascader': {
    config: CascaderConfig
  },
  'el-checkbox-group': {
    config: CheckboxConfig
  },
  'el-color-picker': {
    config: ColorPickerConfig
  },
  'form-designer': {
    config: FormDesignerConfig
  },
  'el-number': {
    config: NumberConfig
  },
  'el-select': {
    config: SelectConfig
  }
};
export const WIDGETS = {
  input: 'input',
  text: 'text',
  password: 'password',
  number: 'number',
  richeditor: 'richeditor',
  select: 'select',
  cascader: 'cascader',
  radioGroup: 'radioGroup',
  checkboxGroup: 'checkboxGroup',
  switch: 'switch',
  row: 'row',
  time: 'time',
  timeRange: 'timeRange',
  date: 'date',
  dateRange: 'dateRange',
  button: 'button',
  rating: 'rating',
  colorPicker: 'colorPicker'
};
export const WidgetTypes = {
  [WIDGETS.input]: require('./input/input-widget'),
  [WIDGETS.text]: require('./text/text-widget'),
  [WIDGETS.password]: require('./password/password-widget'),
  [WIDGETS.number]: require('./number/number-widget'),
  [WIDGETS.richeditor]: require('./text/text-widget'),
  [WIDGETS.select]: require('./select/select-widget'),
  [WIDGETS.cascader]: require('./cascader/cascader-widget'),
  [WIDGETS.radioGroup]: require('./radio-group/radio-group-widget'),
  [WIDGETS.checkboxGroup]: require('./checkbox-group/checkbox-group-widget'),
  [WIDGETS.switch]: require('./switch/switch-widget'),
  [WIDGETS.row]: require('./row/row-widget'),
  [WIDGETS.time]: require('./time/time-widget'),
  [WIDGETS.timeRange]: require('./time-range/time-range-widget'),
  [WIDGETS.date]: require('./date/date-widget'),
  [WIDGETS.dateRange]: require('./date-range/date-range-widget'),
  [WIDGETS.button]: require('./button/button-widget'),
  [WIDGETS.rating]: require('./rating/rating-widget'),
  [WIDGETS.colorPicker]: require('./color-picker/color-picker-widget')
};

export class FormWidgetService {
  widgetInstances;

  getWidgetInstances() {
    if (!this.widgetInstances) {
      for (const i in WidgetTypes) {
        this.widgetInstances[i] = new WidgetTypes[i]();
      }
    }
    return this.widgetInstances;
  }

  refreshWidgetInstances() {
    this.widgetInstances = null;
    return this.getWidgetInstances();
  }

  getWidgetsWithSections() {
    const sections = {};
    const widgets = this.getWidgetInstances();
    for (const widget of widgets) {
      const section = widget.getSection();
      if (!section[section]) {
        sections[section] = [];
      }
      sections.push(widget);
    }
    return sections;
  }
}
