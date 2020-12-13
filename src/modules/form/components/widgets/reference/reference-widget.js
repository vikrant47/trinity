import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';
import { RestQuery } from '@/modules/engine/services/rest.query';

export default class ReferenceWidget extends BaseWidget {
  fetchSuggestions(queryString, cb) {
    return cb([
      { 'value': 'vue', 'link': 'https://github.com/vuejs/vue' },
      { 'value': 'element', 'link': 'https://github.com/ElemeFE/element' },
      { 'value': 'cooking', 'link': 'https://github.com/ElemeFE/cooking' },
      { 'value': 'mint-ui', 'link': 'https://github.com/ElemeFE/mint-ui' },
      { 'value': 'vuex', 'link': 'https://github.com/vuejs/vuex' },
      { 'value': 'vue-router', 'link': 'https://github.com/vuejs/vue-router' },
      { 'value': 'babel', 'link': 'https://github.com/babel/babel' }
    ]);
  }

  getPalletSettings() {
    return {
      label: 'Reference',
      icon: 'reference'
    };
  }

  constructor(settings = {}) {
    super(settings);
  }

  prefix(h, key) {
    return `<template slot="prefix">${this.slot[key]}</template>`;
  }

  suffix(h, key) {
    return `<template slot="suffix">${this.slot[key]}</template>`;
  }

  prepend(h, key) {
    return `<template slot="prepend">${this.slot[key]}</template>`;
  }

  append(h, key) {
    return `<template slot="append">${this.slot[key]}</template>`;
  }

  getEvents() {
    return {
      select(value) {
        // this.renderComponent.$emit('value', value);
      }
    };
  }

  getFieldSettings() {
    const _this = this;
    return {
      async 'fetch-suggestions'(queryString, cb) {
        const data = await new RestQuery(_this.widgetSettings.targetModel).findAll({
          fields: [_this.widgetSettings.key, _this.widgetSettings.displayField]
        });
        cb(data.map(rec => { return { value: rec[_this.widgetSettings.displayField] }; }));
      }
    };
  }

  componentRender(component, h) {
    return h('el-autocomplete', this.getComponentConfig(component), this.getChildren());
  }
}
