import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

export default class DateWidget extends BaseWidget {
  palletSettings = {
    label: 'Date',
    icon: 'date'
  };
  fieldSettings = {
    type: 'datetime'
  };
  overrideConfigSection(configSectionWidgets) {
    configSectionWidgets['fieldSettings.type'].slot.options = [{
      label: 'Date', value: 'date'
    }, {
      label: 'Date Time', value: 'datetime'
    }, {
      label: 'Date Range', value: 'daterange'
    }, {
      label: 'Date Time Range', value: 'datetimerange'
    }, {
      label: 'Month Range', value: 'monthrange'
    }];
  }
  constructor(settings = {}) {
    if (settings.type === 'daterange' || settings.type === 'monthrange') {
      settings = Object.assign({
        type: 'daterange',
        rangeSeparator: 'To',
        startPlaceholder: 'Start Date',
        endPlaceholder: 'End Date'
      }, settings);
    }
    if (settings.type !== 'monthrange') {
      settings = Object.assign({
        pickerOptions: {
          shortcuts: [{
            text: 'Last week',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Last month',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Last 3 months',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
      }, settings);
    }
    super(settings);
  }

  componentRender(component, h) {
    return h('el-date-picker', this.getComponentConfig(component), this.getChildren());
  }
}
