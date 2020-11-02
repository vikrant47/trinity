import { constantRouterMap } from '@/router/routers';
import Layout from '@/layout/index';

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },
  actions: {
    GenerateRoutes({ commit }, asyncRouter) {
      commit('SET_ROUTERS', asyncRouter);
    }
  }
};

export const filterAsyncRouter = (routers) => { // Traverse the routing string from the background and convert it into a component object
  return routers.filter(router => {
    if (router.type) {
      if (router.type === 'folder') { // Layout component special handling
        router.component = Layout;
      } else {
        const component = router.component;
        router.component = loadView(component);
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children);
    }
    return true;
  });
};

export const loadView = (view) => {
  return (resolve) => require([`@/views/${view}`], resolve);
};

export default permission;
