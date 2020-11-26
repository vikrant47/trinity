import InputConfig from '@/modules/form/components/widgets/input/Config';
import ButtonConfig from '@/modules/form/components/widgets/button/Config';
import CascaderConfig from '@/modules/form/components/widgets/cascader/Config';
import CheckboxConfig from '@/modules/form/components/widgets/checkbox-group/Config';
import ColorPickerConfig from '@/modules/form/components/widgets/color-picker/Config';
import FormDesignerConfig from '@/modules/form/components/widgets/form-designer/Config';
import NumberConfig from '@/modules/form/components/widgets/number/Config';
import SelectConfig from '@/modules/form/components/widgets/select/Config';
import * as _ from 'lodash';
import { Engine } from '@/modules/engine/core/engine';

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
  [WIDGETS.input]: require('./input/input-widget').default,
  [WIDGETS.text]: require('./text/text-widget').default,
  [WIDGETS.number]: require('./number/number-widget').default,
  [WIDGETS.richeditor]: require('./text/text-widget').default,
  [WIDGETS.select]: require('./select/select-widget').default,
  [WIDGETS.cascader]: require('./cascader/cascader-widget').default,
  [WIDGETS.radioGroup]: require('./radio-group/radio-group-widget').default,
  [WIDGETS.checkboxGroup]: require('./checkbox-group/checkbox-group-widget').default,
  [WIDGETS.switch]: require('./switch/switch-widget').default,
  [WIDGETS.row]: require('./row/row-widget').default,
  [WIDGETS.time]: require('./time/time-widget').default,
  [WIDGETS.timeRange]: require('./time-range/time-range-widget').default,
  [WIDGETS.date]: require('./date/date-widget').default,
  [WIDGETS.button]: require('./button/button-widget').default,
  [WIDGETS.rating]: require('./rating/rating-widget').default,
  [WIDGETS.colorPicker]: require('./color-picker/color-picker-widget').default
};

export class FormWidgetService {
  widgetInstances = {};

  registerWidget(widgetAlias, type) {
    WidgetTypes[widgetAlias] = type;
  }

  getWidgetByAlias(widgetAlias) {
    return WidgetTypes[widgetAlias];
  }

  unmarshallWidget(widgetJSON) {
    if (typeof widgetJSON === 'string') {
      widgetJSON = JSON.parse(widgetJSON);
    }
    if (typeof widgetJSON.widgetAlias === 'undefined') {
      throw new Error('Unable to unmarshall given json as it doesn\'t have widgetAlias defined');
    }
    const Widget = WidgetTypes[widgetJSON.widgetAlias];
    return Engine.unmarshall(new Widget(), widgetJSON);
  }

  getWidgetInstances() {
    if (_.isEmpty(this.widgetInstances)) {
      for (const i in WidgetTypes) {
        this.widgetInstances[i] = new WidgetTypes[i]();
      }
    }
    return this.widgetInstances;
  }

  getWidgetInstancesAsArray() {
    return Object.values(this.getWidgetInstances());
  }

  cleanWidgets() {
    for (const key in this.widgetInstances) {
      delete this.widgetInstances[key];
    }
  }

  refreshWidgetInstances() {
    this.cleanWidgets();
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
