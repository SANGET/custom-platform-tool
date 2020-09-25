import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';

import { accountLogin } from '@/services/login';
import { getPageQuery, getQueryByParams } from '@/utils/utils';

export interface ILoginModelState {
  message?: string;
}

export interface ILoginModel {
  namespace: string;
  state: ILoginModelState;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    setLoginMessage: Reducer<ILoginModelState>;
  };
}
const inintState: ILoginModelState = {
  message: "",
};
const Model: ILoginModel = {
  namespace: 'login',
  state: inintState,
  effects: {
    /**
     * 用户登录
     * 成功: 进入 / 页面
     * 失败: 设置错误信息
     */
    * login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      if (response.code === 0) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        const queryLink = getQueryByParams(["mode", "app", "lessee"]);
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = `/?${queryLink}`;
            return;
          }
        }
        history.replace(redirect || '/?${queryLink');
      } else {
        yield put({
          type: 'setLoginMessage',
          payload: response.message,
        });
      }
    },
    /**
     * 用户退出
     */
    logout() {
      const {
        redirect, mode, app, lessee
      } = getPageQuery();
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
            mode,
            app,
            lessee
          }),
        });
      }
    },
  },

  reducers: {
    setLoginMessage(state: ILoginModelState = inintState, { payload }): ILoginModelState {
      state.message = payload;
      return state;
    },
  },
};

export default Model;
