import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

export default class CascaderWidget extends BaseWidget {
  palletSettings = {
    label: 'Cascader',
    icon: 'cascader'
  };
  getComponent() {
    return 'el-cascader';
  }
}
