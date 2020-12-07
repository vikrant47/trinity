import { WIDGETS } from '@/modules/form/components/widgets/base-widget/widgets';

export const WidgetTypes = {
  [WIDGETS.input]: require('../input/input-widget').default,
  [WIDGETS.number]: require('../number/number-widget').default,
  [WIDGETS.richeditor]: require('../input/input-widget').default,
  [WIDGETS.select]: require('../select/select-widget').default,
  [WIDGETS.cascader]: require('../cascader/cascader-widget').default,
  [WIDGETS.radioGroup]: require('../radio-group/radio-group-widget').default,
  [WIDGETS.checkboxGroup]: require('../checkbox-group/checkbox-group-widget').default,
  [WIDGETS.switch]: require('../switch/switch-widget').default,
  [WIDGETS.row]: require('../row/row-widget').default,
  [WIDGETS.time]: require('../time/time-widget').default,
  [WIDGETS.timeRange]: require('../time-range/time-range-widget').default,
  [WIDGETS.date]: require('../date/date-widget').default,
  [WIDGETS.button]: require('../button/button-widget').default,
  [WIDGETS.rate]: require('../rate/rate-widget').default,
  [WIDGETS.colorPicker]: require('../color-picker/color-picker-widget').default,
  [WIDGETS.formDesigner]: require('../form-designer/form-designer-widget').default,
  [WIDGETS.reference]: require('../reference/reference-widget').default
};
