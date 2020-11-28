import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

export default class CascaderWidget extends BaseWidget {
  getPalletSettings() {
    return {
      label: 'Cascader',
      icon: 'cascader'
    };
  }

  componentRender(component, h) {
    return h('el-cascader', this.prepareComponentConfig(), this.getChildren());
  }
}
