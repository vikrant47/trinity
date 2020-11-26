import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

export default class InputWidget extends BaseWidget {
  constructor(settings = {}) {
    if (settings.type === 'password') {
      settings.showPassword = true;
    }
    super(settings);
  }
}
