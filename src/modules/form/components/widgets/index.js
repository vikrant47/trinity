import * as _ from 'lodash';
import { Engine } from '@/modules/engine/core/engine';

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
  rate: 'rate',
  colorPicker: 'colorPicker',
  formDesigner: 'formDesigner'
};
export const WidgetTypes = {
  [WIDGETS.input]: require('./input/input-widget').default,
  [WIDGETS.number]: require('./number/number-widget').default,
  [WIDGETS.richeditor]: require('./input/input-widget').default,
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
  [WIDGETS.rate]: require('./rate/rate-widget').default,
  [WIDGETS.colorPicker]: require('./color-picker/color-picker-widget').default,
  [WIDGETS.formDesigner]: require('./form-designer/form-designer-widget').default
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

  getWidgetInstanceByAlias(widgetAlias, fieldSettings = {}, widgetSettings = {}) {
    const Widget = new FormWidgetService().getWidgetByAlias(widgetAlias);
    return new Widget(fieldSettings, widgetSettings);
  }

  /** Return the widget instance from given json*/
  getWidgetInstance(widgetJSON, loadConfigSection = true) {
    if (typeof widgetJSON === 'string') {
      widgetJSON = JSON.parse(widgetJSON);
    }
    if (typeof widgetJSON.widgetAlias !== 'string') {
      throw new Error('Invalid json, widgetAlias key doesn\'t exists');
    }
    const Widget = new FormWidgetService().getWidgetByAlias(widgetJSON.widgetAlias);
    widgetJSON = new Widget(widgetJSON);
    /* if (loadConfigSection === true) {
      widgetJSON.loadConfigForConfigSection();
    }*/
    return widgetJSON;
  }
}
