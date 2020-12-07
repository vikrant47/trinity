import { BaseWidget } from '@/modules/form/components/widgets/base-widget/base-widget';

export default class ReferenceWidget extends BaseWidget {
  getFieldSettings() {
    return {
      'fetch-suggestions'(queryString, cb) {
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
    };
  }

  getEvents() {
    return {
      select($event) {

      }
    };
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

  componentRender(component, h) {
    return h('el-autocomplete', this.getComponentConfig(component), this.getChildren());
  }
}
