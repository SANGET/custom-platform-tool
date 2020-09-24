import { Effect, Reducer } from 'umi';

import { queryCurrent } from '@/services/user';

export interface ICurrentUser {
  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  userid?: string;
  unreadCount?: number;
}

export interface IUserModelState {
  currentUser?: ICurrentUser;
}

export interface IUserModel {
  namespace: 'user';
  state: IUserModelState;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    setCurrentUser: Reducer<IUserModelState>;
  };
}

const UserModel: IUserModel = {
  namespace: 'user',

  state: {

  },

  effects: {
    * fetchCurrent({ payload }, { call, put }) {
      const response = yield call(queryCurrent);
      if (response.code === 0) {
        yield put({
          type: 'setCurrentUser',
          payload: response.result,
        });
      }
    },
  },

  reducers: {
    /**
     * 保存用户信息
     * @param state
     * @param param1
     */
    setCurrentUser(state, { payload }) {
      return {
        ...state,
        ...payload || {},
      };
    }
  }
};

export default UserModel;
