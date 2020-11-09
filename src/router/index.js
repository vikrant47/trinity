import router from './routers';
import store from '@/store';
import Config from '@/settings';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';// progress bar style
import { getToken } from '@/utils/auth'; // getToken from cookie
import { NavigationService } from '@/modules/navigation/services/navigation.service';

NProgress.configure({ showSpinner: false });// NProgress Configuration

const whiteList = ['/login'];// no redirect whitelist
const navService = NavigationService.getInstance();

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + Config.title;
  }
  NProgress.start();
  if (getToken()) {
    // The page you have logged in and you want to jump to is the login page
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      next();
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // In the whitelist without login, enter directly
      next();
    } else {
      next(`/login?redirect=${to.fullPath}`); // Otherwise all redirect to the login page
      NProgress.done();
    }
  }
});

export const loadMenus = (next, to) => {
  /* navService.getNavigations().then(res => {
    const asyncRouter = navService.navDataToRoute(res);
    asyncRouter.push({ path: '*', redirect: '/404', hidden: true });
    store.dispatch('GenerateRoutes', asyncRouter).then(() => { // Storage routing
      router.addRoutes(asyncRouter); // Dynamically add accessible routing table
      next({ ...to, replace: true });
    });
  });*/
};

router.afterEach(() => {
  NProgress.done(); // finish progress bar
});
