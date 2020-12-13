import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import FormDesigner from '@/modules/form/components/widgets/form-designer/designer/FormDesigner';

export default class FormDesignerWidget extends BaseWidget {
  getPalletSettings() {
    return {
      label: 'Form Designer',
      icon: 'form'
    };
  }

  componentRender(component, h) {
    if (this.designMode) {
      return h('div', {
        domProps: {
          innerHTML: '<h3>Form Designer</h3>'
        },
        class: {

        },
        style: {
          width: '500px'
        }
      });
    } else {
      return h(FormDesigner, this.getComponentConfig(component), this.getChildren());
    }
  }
}
