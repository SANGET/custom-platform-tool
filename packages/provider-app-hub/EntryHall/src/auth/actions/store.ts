import createStore from "unistore";
import { Call, EventEmitter } from "@mini-code/base-func";

import * as AUTH_APIS from "./apis";

export interface AuthStore {
  /** 用户信息 */
  userInfo: any;
  // menuStore: {};
  /** 用户名 */
  username: string;
  /** 登录后的返回信息 */
  loginResDesc: string;
  /** 是否自动登录中 */
  autoLoging: boolean;
  /** 是否登录中 */
  logging: boolean;
  /** 是否登出中 */
  logouting: boolean;
  /** 是否已登录 */
  isLogin: boolean;
  /** token */
  token: string;
}

export function getPrevLoginToken() {
  const res = getPrevLoginData();
  return res ? res.token : null;
}

const PREV_LOGIN_DATA = 'prev/login/data';

const handleLoginSuccess = (loginRes) => loginRes.code === '00000';

const defaultAuthStore: AuthStore = {
  userInfo: {},
  username: "",
  loginResDesc: "",
  autoLoging: !!getPrevLoginToken(),
  logging: false,
  logouting: false,
  isLogin: !!getPrevLoginToken(),
  // isLogin: process.env.NODE_ENV === 'development',
  token: "",
  // menuStore: NAV_MENU_CONFIG
};
const authStore = createStore(defaultAuthStore);

/**
 * AuthActions 的类型
 */
export type AuthActions = (store: typeof authStore) => ({
  autoLogin: (state) => void;
  login: (state, form, onSuccess) => void;
  logout: (state) => void;
})

/**
 * 处理登录成功的回调
 */
function onLoginSuccess(resData) {
  const userInfo = resData;
  const { username } = resData;
  userInfo.username = username;
  // let menuStore = (userInfo.Menus || {}).Child;
  const { token } = resData.loginSuccessInfo || {};
  // delete userInfo['Menus'];
  const resultStore = {
    logging: false,
    autoLoging: false,
    isLogin: true,
    token,
    username,
    userInfo
    // menuStore
  };

  EventEmitter.emit("LOGIN_SUCCESS", { userInfo, loginRes: resData });
  localStorage.setItem(PREV_LOGIN_DATA, JSON.stringify(resultStore));

  return resultStore;
}

/**
 * 清除所有登录信息
 */
function clearPrevLoginData() {
  localStorage.removeItem(PREV_LOGIN_DATA);
}

/**
 * 获取上次登录的信息
 */
function getPrevLoginData(): AuthStore | undefined {
  const res = localStorage.getItem(PREV_LOGIN_DATA);
  let result;
  if (res) {
    try {
      result = JSON.parse(res);
    } catch (e) {
      console.log(e);
    }
  }
  return result;
}

/**
 * unistore 的 action
 */
const authActions: AuthActions = (store) => ({
  /** 自动登录 */
  async autoLogin() {
    // const token = getPrevLoginToken();
    /** TODO: 是否有做 token 是否有效的接口验证 */
    const prevLoginRes = getPrevLoginData();
    if (!prevLoginRes) return;
    // const loginRes = await AUTH_APIS.login({
    //   token
    // });
    /** 判断是否登录成功的逻辑 */
    // const isLogin = handleLoginSuccess(loginRes);
    // if (isLogin) {
    // const nextStore = onLoginSuccess(
    //   Object.assign({}, getPrevLoginData(), loginRes.data)
    // );
    store.setState(prevLoginRes);
    // }
  },
  /** 主动登录 */
  async login(state, form, onSuccess) {
    store.setState({
      logging: true
    });
    const loginRes = await AUTH_APIS.login(form);
    /** 判断是否登录成功的逻辑 */
    const isLogin = handleLoginSuccess(loginRes);
    if (isLogin) {
      Call(onSuccess, form);
      const nextStore = onLoginSuccess(Object.assign({}, loginRes.result, form));
      store.setState(nextStore);
    } else {
      store.setState({
        logging: false,
        loginResDesc: loginRes.message
      });
    }
  },
  /** 主动登出 */
  async logout() {
    store.setState({
      logouting: true
    });
    await AUTH_APIS.logout();
    store.setState({
      ...defaultAuthStore,
      isLogin: false
    });
    clearPrevLoginData();
  }
});

export { authStore, authActions };
