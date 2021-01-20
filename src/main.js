import Vue from 'vue';

import Cookies from 'js-cookie';

import 'normalize.css/normalize.css';

import Element from 'element-ui';
//
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';

// Data Dictionary
import dict from './components/Dict';

// Permission instruction
import permission from './components/Permission';
import './assets/styles/element-variables.scss';
// global css
import './assets/styles/index.scss';

// Code highlight
import VueHighlightJS from 'vue-highlightjs';
import 'highlight.js/styles/atom-one-dark.css';

import App from './App';
import store from './store';
import router from './router/routers';

import './assets/icons'; // icon
import './router/index'; // permission control
import 'echarts-gl';

// custom css
import './assets/styles/custom.scss';

// filters
import './modules/engine/filters/index';

Vue.use(VueHighlightJS);
Vue.use(mavonEditor);
Vue.use(permission);
Vue.use(dict);
Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size
});

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
