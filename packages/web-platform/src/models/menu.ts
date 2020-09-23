import { Reducer, Effect } from 'umi';
import { queryMenuList } from '@/services/menu';
import { construct } from '@/utils/utils';
import { ROUTER_SUFFIX } from '@/constant';

export interface IMenusModelState {
  list: any[];
}

export interface IMenusModel {
  namespace: string;
  state: IMenusModelState;
  effects: {
    getMenu: Effect;
  };
  reducers: {
    setMeunList: Reducer<IMenusModelState>;
  };
}
const inintState = {
  list: [],
};
const MenusModel: IMenusModel = {
  namespace: 'menus',

  state: inintState,

  effects: {
    * getMenu({ payload }, { call, put }) {
      const response = yield call(queryMenuList, payload);
      if (response.code === 0) {
        yield put({
          type: 'setMeunList',
          payload: response.result,
        });
      }
      return response;
    },
  },

  reducers: {
    setMeunList(state: IMenusModelState = inintState, { payload }): IMenusModelState {
      const list: any[] = construct(payload, {
        mapping: {
          name: "menuName",
          path: "id"
        },
        attribute: {
          page: ROUTER_SUFFIX
        }
      });
      state.list = list;
      return state;
    }
  },
};

export default MenusModel;
