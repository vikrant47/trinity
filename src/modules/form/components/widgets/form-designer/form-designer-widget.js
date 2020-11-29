import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import FormDesigner from '@/modules/form/components/widgets/form-designer/FormDesigner';

export default class FormDesignerWidget extends BaseWidget {
  getPalletSettings() {
    return {
      label: 'Form Designer',
      icon: 'form'
    };
  }

  componentRender(component, h) {
    return h(FormDesigner, {
      attrs: this.prepareComponentConfig(),
      props: {}
    }, this.getChildren());
  }
}
