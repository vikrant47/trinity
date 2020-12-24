import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import { ITEM_LAYOUT } from '@/modules/form/components/widgets/base-widget/widget-config';

export default class RowWidget extends BaseWidget {
  palletSettings = {
    label: 'Row',
    icon: 'row'
  };
  widgetSettings = {
    layout: ITEM_LAYOUT.rowFormItem,
    children: []
  };

  componentRender(component, h) {
    return h('el-row', this.getComponentConfig(component), this.getChildren());
  }
}
