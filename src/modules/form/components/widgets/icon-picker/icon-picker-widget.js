import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import IconsDialog from '@/modules/form/components/widgets/icon-picker/IconsDialog';

export default class IconPickerWidget extends BaseWidget {
  getPalletSettings() {
    return {
      label: 'Icon',
      icon: 'icon'
    };
  }

  componentRender(component, h) {
    const iconDialogConf = {
      attrs: { 'visible': this.getData().visibleIconPopup || false },
      on: {
        close() {
          // document.querySelector('').style.display = 'none';
          iconDialogConf.attrs.visible = false;
          setTimeout(() => {
            document.querySelector('.icon-dialog .v-modal').style.display = 'none';
            component.$emit('widget-data', { visibleIconPopup: false });
          }, 500);
        },
        select(icon) {
          component.$emit('input', icon);
          iconDialogConf.attrs.visible = false;
          component.$emit('widget-data', { visibleIconPopup: false });
        }
      }
    };
    return h('div', { class: 'icon-widget' }, [
      h('el-input', this.getComponentConfig(), [
        h('el-button', {
          slot: 'append',
          attrs: { type: 'primary', icon: 'el-icon-thumb' }, on: {
            click() {
              component.$emit('widget-data', { visibleIconPopup: true }); // emitting data event to store additional data
            }
          }
        })
      ]),
      h(IconsDialog, iconDialogConf, this.getChildren())
    ]);
  }
}
