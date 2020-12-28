export const FORM_EVENTS = {
  form: {
    error: 'form.error',
    init: 'form.init',
    beforeRender: 'form.beforeRender',
    afterRender: 'form.afterRender',
    beforeDestroy: 'form.beforeDestroy',
    beforeSubmit: 'form.beforeSubmit'
  },
  definition: {
    beforeFetch: 'beforeFetch',
    fetch: 'fetch'
  },
  widget: {
    init: 'widget.init',
    updateValue: 'widget.updateValue',
    beforeUpdateWidgetConfig: 'widget.updateWidgetConfigs',
    updateWidgetConfig: 'widget.updateWidgetConfigs',
    error: 'widget.error'
  },
  model: {
    beforeFetch: 'beforeFetch',
    beforeSave: 'beforeSave',
    beforeCreate: 'beforeCreate',
    beforeUpdate: 'beforeUpdate',
    beforeDelete: 'beforeDelete',
    fetch: 'fetch',
    save: 'save',
    create: 'create',
    update: 'update',
    delete: 'delete'
  }
};

export class FormEvent {
  name;
  data;

  constructor(name, data = {}) {
    this.name = name;
    this.data = data;
  }

  getData() {
    return this.data;
  }

  getName() {
    return this.name;
  }
}

export class WidgetEvent extends FormEvent {
  name;
  widget;

  constructor(name, widget, data = {}) {
    super(name, data);
    this.name = name;
    this.data = data;
    this.widget = widget;
  }

  getWidget() {
    return this.widget;
  }
}
