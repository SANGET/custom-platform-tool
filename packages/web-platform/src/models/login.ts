/* eslint-disable camelcase */
import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';
import store from 'store';
import { accountLogin } from '@/services/login';
import { getPageQuery, getQueryByParams } from '@/utils/utils';

export interface ILoginModelState {
  message?: string;
  token?: string;
  refreshToken?: string;
}

export interface ILoginModelAction {
  payload: API.ILoginType;
}

export interface ILoginModel {
  namespace: string;
  state: ILoginModelState;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    setLoginInfo: Reducer<ILoginModelState>;
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
    * login({ payload }, { call, put, select }) {
      const response: API.ILoginType = yield call(accountLogin, payload);
      // const response = { code: 0, message: "" };
      if (response.code === 0) {
        yield put({
          type: 'setLoginInfo',
          payload: response,
        });
      } else {
        yield put({
          type: 'setLoginMessage',
          payload: response.message,
        });
      }

      return response;
    },
    /**
     * 用户退出
     */
    logout() {
      const {
        redirect, mode, app, lessee
      } = getPageQuery();
      store.remove("token");
      store.remove("refreshToken");
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
    setLoginInfo(state: ILoginModelState = inintState, { payload }): ILoginModelState {
      const { access_token, refresh_token } = payload;
      store.set("token", access_token);
      store.set("refreshToken", refresh_token);
      return {
        ...state,
        ...payload,
      };
    },
    setLoginMessage(state: ILoginModelState = inintState, { payload }): ILoginModelState {
      state.message = payload;
      return state;
    },
  },
};

export default Model;
