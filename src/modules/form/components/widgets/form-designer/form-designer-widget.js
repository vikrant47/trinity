import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import FormDesigner from '@/modules/form/components/widgets/form-designer/designer/FormDesigner';

export default class FormDesignerWidget extends BaseWidget {
  init() {
    // this.transient.push({ widgetSettings: ['pallet'] });
  }

  palletSettings = {
    label: 'Form Designer',
    icon: 'form'
  };
  widgetSettings = {
    pallet: []
  };

  addPallet(pallet) {
    this.widgetSettings.pallet.push(pallet);
    return this;
  }

  overrideWidgetSettings(widgetSettings) {
    const FormWidgetService = require('@/modules/form/services/form.widget.service').FormWidgetService;
    widgetSettings.pallet.push({
      title: 'Custom',
      list: new FormWidgetService().getWidgetInstancesAsArray()
    });
  }

  getPallet(widgetSettings) {
    const FormWidgetService = require('@/modules/form/services/form.widget.service').FormWidgetService;
    return widgetSettings.pallet.map((entry) => {
      entry.list = entry.list.map((widget) => {
        if (!(widget instanceof BaseWidget)) {
          widget = new FormWidgetService().getWidgetInstance(widget);
        }
        return widget;
      });
      return entry;
    });
  }

  componentRender(component, h) {
    const config = this.getComponentConfig();
    if (this.designMode) {
      return h('div', {
        domProps: {
          innerHTML: '<h3>Form Designer</h3>'
        },
        class: {},
        style: {
          width: '500px'
        }
      });
    } else {
      return h(FormDesigner, {
        props: {
          pallet: this.getPallet(config)
        }
      }, this.getChildren());
    }
  }
}
