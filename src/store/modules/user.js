import { login, getInfo, logout } from '@/api/login';
import { getToken, setToken, removeToken } from '@/utils/auth';

const user = {
  state: {
    token: getToken(),
    user: {},
    roles: [],
    // Used when loading the menu for the first time
    loadMenus: false
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USER: (state, user) => {
      state.user = user;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus;
    }
  },

  actions: {
    // log in
    Login({ commit }, userInfo) {
      const rememberMe = userInfo.rememberMe;
      return new Promise((resolve, reject) => {
        login(userInfo.username, userInfo.password, userInfo.code, userInfo.uuid).then(res => {
          const contents = res.contents;
          setToken(contents.token, rememberMe);
          commit('SET_TOKEN', contents.token);
          setUserInfo(contents, commit);
          // Used when loading the menu for the first time, See specifically src Under the directory permission.js
          commit('SET_LOAD_MENUS', true);
          resolve(res);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // Get user information
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          setUserInfo(res, commit);
          resolve(res);
        }).catch(error => {
          reject(error);
        });
      });
    },
    // Sign out
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(res => {
          logOut(commit);
          resolve();
        }).catch(error => {
          logOut(commit);
          reject(error);
        });
      });
    },

    updateLoadMenus({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', false);
      });
    }
  }
};

export const logOut = (commit) => {
  commit('SET_TOKEN', '');
  commit('SET_ROLES', []);
  removeToken();
};

export const setUserInfo = (res, commit) => {
  // If there is no permission, give a default permission to avoid the endless loop of requests
  if (res.roles && res.roles.length === 0) {
    commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT']);
  } else {
    commit('SET_ROLES', res.roles);
  }
  commit('SET_USER', res.user);
};

export default user;
