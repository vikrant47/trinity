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
export const widgetConfig = {
  string: require('./input/input-widget'),
  text: require('./text/text-widget'),
  password: require('./password/password-widget'),
  number: require('./number/number-widget'),
  richeditor: require('./text/text-widget'),
  select: require('./select/select-widget'),
  cascader: require('./cascader/cascader-widget'),
  radioGroup: require('./radio-group/radio-group-widget'),
  checkboxGroup: require('./checkbox-group/checkbox-group-widget'),
  switch: require('./switch/switch-widget'),
  slider: require('./slider/slider-widget'),
};
