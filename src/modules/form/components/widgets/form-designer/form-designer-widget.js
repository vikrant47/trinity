import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

export default class FormDesignerWidget extends BaseWidget {
  getPalletSettings() {
    return {
      label: 'Form Designer',
      icon: 'form'
    };
  }
}
