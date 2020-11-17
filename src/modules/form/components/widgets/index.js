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
