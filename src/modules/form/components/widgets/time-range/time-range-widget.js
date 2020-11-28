import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

export default class TimeRangeWidget extends BaseWidget {
  getPalletSettings() {
    return {
      label: 'Time Range',
      icon: 'timerange'
    };
  }
}
