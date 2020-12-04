import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

export default class TimeWidget extends BaseWidget {
  getPalletSettings() {
    return {
      label: 'Time',
      icon: 'time'
    };
  }

  constructor(settings = {}) {
    settings = Object.assign({
      pickerOptions: {
        // start: '08:30',
        // step: '00:15',
        // end: '18:30',
        // selectableRange: '18:30:00 - 20:30:00'
      }
    }, settings);
    super(settings);
  }

  buildTimeRangeComponents(h) {
    const attrs = this.getComponentConfig();
    const fromAttrs = Object.assign({}, attrs, {
      start: attrs['fromStart'],
      steps: attrs['formSteps'],
      end: attrs['fromEnd'],
      selectableRange: attrs['fromSelectableRange']
    });
    const toAttrs = Object.assign({}, attrs, {
      start: attrs['fromStart'],
      steps: attrs['formSteps'],
      end: attrs['fromEnd'],
      selectableRange: attrs['fromSelectableRange']
    });
    return [
      h('el-time-select', { attrs: fromAttrs }),
      h('el-time-select', { attrs: toAttrs })
    ];
  }

  componentRender(component, h) {
    if (this.type === 'timerange') {
      h('div', { class: { 'time-range': true }}, this.buildTimeRangeComponents(h));
    }
    return h('time-select', this.getComponentConfig(), this.getChildren());
  }
}
