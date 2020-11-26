<script>
import draggable from 'vuedraggable';
import render from '@/modules/form/components/render/render';
import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

const components = {
  itemBtns(h, currentItem, index, list) {
    const { copyItem, deleteItem, showConfig } = this.$listeners;
    return [
      <span class='drawing-item-copy' title='Copy' onClick={event => {
        copyItem(currentItem, list);
        event.stopPropagation();
      }}>
        <i class='el-icon-copy-document'/>
      </span>,
      <span class='drawing-item-delete' title='Delete' onClick={event => {
        deleteItem(index, list);
        event.stopPropagation();
      }}>
        <i class='el-icon-delete'/>
      </span>,
      <span className='drawing-item-config' title='Configurations' onClick={event => {
        showConfig(index, list);
        event.stopPropagation();
      }}>
        <i className='el-icon-setting'/>
      </span>
    ];
  }
};
const layouts = {
  colFormItem(h, currentItem, index, list) {
    const { activeItem } = this.$listeners;
    const config = currentItem.component;
    const child = renderChildren.apply(this, arguments);
    let className = this.activeId === config.formId ? 'drawing-item active-from-item' : 'drawing-item';
    if (this.formConf.unFocusedComponentBorder) className += ' unfocus-bordered';
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null;
    if (config.showLabel === false) labelWidth = '0';
    return (
      <el-col span={config.span} class={className}
        nativeOnClick={event => {
          activeItem(currentItem);
          event.stopPropagation();
        }}>
        <el-form-item label-width={labelWidth}
          label={config.showLabel ? config.label : ''} required={config.required}>
          <render key={config.renderKey} conf={currentItem} onInput={event => {
            this.$set(config, 'defaultValue', event);
          }}>
            {child}
          </render>
        </el-form-item>
        {components.itemBtns.apply(this, arguments)}
      </el-col>
    );
  },
  rowFormItem(h, currentItem, index, list) {
    const { activeItem } = this.$listeners;
    const config = currentItem.component;
    const className = this.activeId === config.formId
      ? 'drawing-row-item active-from-item'
      : 'drawing-row-item';
    let child = renderChildren.apply(this, arguments);
    if (currentItem.type === 'flex') {
      child = <el-row type={currentItem.type} justify={currentItem.justify} align={currentItem.align}>
        {child}
      </el-row>;
    }
    return (
      <el-col span={config.span}>
        <el-row gutter={config.gutter} class={className}
          nativeOnClick={event => {
            activeItem(currentItem);
            event.stopPropagation();
          }}>
          <span class='component-name'>{config.componentName}</span>
          <draggable list={config.children || []} animation={340}
            group='componentsGroup' class='drag-wrapper'>
            {child}
          </draggable>
          {components.itemBtns.apply(this, arguments)}
        </el-row>
      </el-col>
    );
  },
  raw(h, currentItem, index, list) {
    const config = currentItem.component;
    const child = renderChildren.apply(this, arguments);
    return <render key={config.renderKey} conf={currentItem} onInput={event => {
      this.$set(config, 'defaultValue', event);
    }}>
      {child}
    </render>;
  }
};

function renderChildren(h, currentItem, index, list) {
  const config = currentItem.component;
  if (!Array.isArray(config.children)) return null;
  return config.children.map((el, i) => {
    const layout = layouts[el.component.layout];
    if (layout) {
      return layout.call(this, h, el, i, config.children);
    }
    return layoutIsNotFound.call(this);
  });
}

function layoutIsNotFound() {
  throw new Error(`Matching layout fount with ${this.currentItem.component.layout}`);
}

export default {
  components: {
    render,
    draggable
  },
  props: [
    'currentItem',
    'index',
    'drawingList',
    'activeId',
    'formConf'
  ],
  render(h) {
    const layout = layouts[this.currentItem.component.layout];

    if (layout) {
      return layout.call(this, h, this.currentItem, this.index, this.drawingList);
    }
    return layoutIsNotFound.call(this);
  }
};
</script>
