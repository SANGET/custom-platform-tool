import { Effect, Reducer } from 'umi';

import { queryCurrent } from '@/services/user';
import store from 'store';

export interface IAccount {
  "create_userid": string;
  "PswLastChangeTime": string;
  "create_time": number;
  "loginname": string;
  "MemberId": string;
  "last_update_time": number;
  "password": string;
  "last_update_userid": string;
  "yonghunichen": string;
  "bczt": number;
  "_state": string;
  "qiyonghuojinyongzhuangtai": string;
  "id": string;
  "username": string;

}
export interface IOrganization {
  "create_userid": string;
  "create_time": number;
  "bczt": number;
  "name": string;
  "id": string;
  "Code": string;

}
export interface IRoles {
  "IsRoot": string;
  "last_update_time": number;
  "create_time": number;
  "bczt": number;
  "jiaosebieming": string;
  "name": string;
  "id": string;
  "Remark": string;

}
export interface IMember {
  "create_userid": string;
  "Email": string;
  "create_time": number;
  "Sex": string;
  "MobilePhone": string;
  "Weight": string;
  "Name": string;
  "OrgId": string;
  "last_update_time": number;
  "last_update_userid": string;
  "bczt": number;
  "WorkNumber": string;
  "Height": string;
  "id": string;
  "PostStatus": string;

}
export interface IUserModelState {
  account? : IAccount;
  organization?: IOrganization;
  roles?: IRoles[];
  member?: IMember;
  token?: string;
  refreshToken?: string;
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
const inintState: IUserModelState = {
  token: store.get("token"),
  refreshToken: store.get("token"),
};
const UserModel: IUserModel = {
  namespace: 'user',

  state: inintState,

  effects: {
    * fetchCurrent({ payload }, { call, put }) {
      const response = yield call(queryCurrent);
      if (response?.code === 0) {
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
