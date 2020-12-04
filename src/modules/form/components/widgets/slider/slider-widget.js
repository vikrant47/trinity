import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

export default class SliderWidget extends BaseWidget {
  getPalletSettings() {
    return {
      label: 'Slider',
      icon: 'slider'
    };
  }

  componentRender(component, h) {
    return h('el-slider', this.getComponentConfig(), this.getChildren());
  }
}
