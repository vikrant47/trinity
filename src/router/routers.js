import Vue from 'vue';
import Router from 'vue-router';
import Layout from '../layout/index';

Vue.use(Router);

export const constantRouterMap = [
  {
    path: '/login',
    meta: { title: 'Log In', noCache: true },
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/features/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/features/401'], resolve),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: (resolve) => require(['@/views/features/redirect'], resolve)
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: (resolve) => require(['@/modules/dashboard/views/index'], resolve),
        name: 'Dashboard',
        meta: { title: 'Home', icon: 'index', affix: true, noCache: true }
      }, {
        path: 'models/:modelAlias/list/:list',
        component: (resolve) => require(['@/modules/list/views/index'], resolve),
        name: 'List',
        meta: { title: 'Home', icon: 'index', affix: true, noCache: true }
      }, {
        path: '/models/:modelAlias/form/:formId/:recordId',
        component: (resolve) => require(['@/modules/list/views/index'], resolve),
        name: 'Form',
        meta: { title: 'Home', icon: 'index', affix: true, noCache: true }
      }, {
        path: 'widgets/:widgetId/render',
        component: (resolve) => require(['@/modules/list/views/index'], resolve),
        name: 'Widget',
        meta: { title: 'Home', icon: 'index', affix: true, noCache: true }
      }, {
        path: 'dashboards/:dashboardId/render',
        component: (resolve) => require(['@/modules/list/views/index'], resolve),
        name: 'Dashboard',
        meta: { title: 'Home', icon: 'index', affix: true, noCache: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: (resolve) => require(['@/views/system/user/center'], resolve),
        name: '个人中心',
        meta: { title: '个人中心' }
      }
    ]
  }
];

export default new Router({
  // mode: 'hash',
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
