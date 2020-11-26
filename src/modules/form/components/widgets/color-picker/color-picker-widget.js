import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

export default class colorPickerWidget extends BaseWidget {
  getComponent() {
    return 'el-color-picker';
  }
}
