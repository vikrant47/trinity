import Layout from '@/layout/index';
import ListView from '@/modules/list/views/index';
import * as DashboardView from '@/modules/dashboard/views/index';
import request from '@/utils/request';
import { TenantService } from '@/modules/engine/services/tenant.service';

export const NavComponentMapping = {
  folder: Layout,
  list: ListView,
  // form: FormView,
  dashboard: DashboardView
  /* widget:,
  uipage:,
  iframe: Iframe*/
};
export const NavRoutConfig = {
  folder: {
    path: '',
    component: Layout
  },
  list: {
    path: '/models/:modelAlias/list/:listId',
    component: ListView
  },
  form: {
    path: '/models/:modelAlias/form/:formId/:recordId',
    component: ListView
  },
  dashboard: {
    path: '/dashboard/:dashboardId',
    component: DashboardView
  },
  widget: {
    path: '/widget/:widgetId',
    component: DashboardView
  }
};

export class NavigationService {
  /** @type instance NavigationService*/
  static instance = new NavigationService();

  /** @return NavigationService*/
  static getInstance() {
    return NavigationService.instance;
  }

  naviagtions = [];
  flatNavs = [];
  navPromise;

  getMenusTree(pid) {
    return request({
      url: 'api/menus/lazy?pid=' + pid,
      method: 'get'
    });
  }

  getNavigations() {
    if (!this.navPromise) {
      this.navPromise = new Promise((resolve, reject) => {
        if (this.naviagtions.length === 0) {
          TenantService.instance.request({
            url: '/api/engine/navigations',
            method: 'get'
          }).then(navs => {
            this.naviagtions = this.navDataToRoute(navs.contents);
            resolve(this.naviagtions);
          }).catch(err => reject(err));
        } else {
          resolve(this.naviagtions);
        }
      });
    }
    return this.navPromise;
  }

  getFlatNavigations() {
    return new Promise((resolve, reject) => {
      if (this.flatNavs.length === 0) {
        this.getNavigations().then(navs => {
          this.flatNavs = this.navDataToFlatArray(navs);
          resolve(this.flatNavs);
        });
      } else {
        resolve(this.flatNavs);
      }
    });
  }

  getNavigationSuperior(ids) {
    const data = ids.length || ids.length === 0 ? ids : Array.of(ids);
    return request({
      url: 'api/menus/superior',
      method: 'post',
      data
    });
  }

  getChild(id) {
    return request({
      url: 'api/menus/child?id=' + id,
      method: 'get'
    });
  }

  add(data) {
    return request({
      url: 'api/menus',
      method: 'post',
      data
    });
  }

  del(ids) {
    return request({
      url: 'api/menus',
      method: 'delete',
      data: ids
    });
  }

  edit(data) {
    return request({
      url: 'api/menus',
      method: 'put',
      data
    });
  }

  getRouteConfig(nav) {
    const route = Object.assign({ component: Layout, path: nav.name }, NavRoutConfig[nav.type]);
    route.meta = nav;
    route.name = nav.label; // setting name in route
    route.meta.title = nav.label;
    route.id = nav.id;
    if (nav.type === 'folder') {
      route.path = nav.name;
    }
    if (nav.type === 'list') {
      route.path = route.path.replace(':listId', nav.list || 'default').replace(':modelAlias', (nav.modelAlias || '').toLowerCase());
    } else if (nav.type === 'form') {
      route.path = route.path
        .replace(':formId', nav.form || 'default')
        .replace(':recordId', nav.record_id || 'new')
        .replace(':modelAlias', (nav.modelAlias || '').toLowerCase());
    } else if (nav.type === 'widget') {
      route.path = route.path.replace(':widgetId', nav.widget_id);
    } else if (nav.type === 'dashboard') {
      route.path = route.path.replace(':dashboardId', nav.dashboard_id);
    }
    return route;
  }

  navDataToFlatArray(navigation) {
    return navigation.reduce((result, nav) => {
      nav = Object.assign({}, nav); // cloning nav
      const children = nav.children;
      delete nav.children;
      result.push(nav);
      if (children && children.length > 0) {
        result = result.concat(this.navDataToFlatArray(children));
      }
      return result;
    }, []);
  }

  navDataToRoute(navigation) { // Traverse the routing string from the background and convert it into a component object
    return navigation.map(nav => {
      const route = this.getRouteConfig(nav);
      if (nav.children && nav.children.length) {
        route.children = this.navDataToRoute(nav.children);
      }
      return route;
    });
  }
}
