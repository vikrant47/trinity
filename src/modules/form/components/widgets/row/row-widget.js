import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

export default class RowWidget extends BaseWidget {
  getPalletSettings() {
    return {
      label: 'Row',
      icon: 'row'
    };
  }

  componentRender(component, h) {
    return h('el-row', this.getComponentConfig(), this.getChildren());
  }
}
