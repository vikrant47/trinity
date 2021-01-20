import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import Markdown from '@/modules/form/components/widgets/richeditor/MarkDown';

export default class RicheditorWidget extends BaseWidget {
  heights = { small: '200px', medium: '300px', large: '500px' };
  palletSettings = {
    label: 'Rich Editor',
    icon: 'edit'
  };

  overrideConfigSection(configSectionWidgets) {
    configSectionWidgets['fieldSettings.size'].slot.options = [{
      label: 'Small', value: 'small'
    }, {
      label: 'Medium', value: 'medium'
    }, {
      label: 'Large', value: 'large'
    }];
  }

  overrideFieldSettings(fieldSettings) {
    Object.assign(fieldSettings, {
      language: 'en',
      subfield: false,
      defaultOpen: 'preview',
      editable: true
    });
    if (!fieldSettings.value) {
      fieldSettings.value = '';
    }
    return fieldSettings;
  }

  getEvents() {
    const _this = this;
    return {
      change(value) {
        _this.setValue(value);
      }
    };
  }

  componentRender(component, h) {
    const config = this.getComponentConfig(component);
    const options = {
      on: this.getEvents(),
      props: {
        height: this.heights[config.attrs.size] || this.heights.small,
        value: config.attrs.value,
      }
    };
    return h(Markdown, options, this.getChildren());
  }
}
