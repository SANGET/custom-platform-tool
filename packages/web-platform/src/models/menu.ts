import { Reducer, Effect } from 'umi';
import { queryMenuList } from '@/services/menu';
import { construct } from '@/utils/utils';
import { ROUTER_SUFFIX, MODE_PREVIEW } from '@/constant';

export interface IMenuItem {
  id: string;
  name: string;
  pageLink?: string;
  icon?: string;
  pid: string;

  children?: IMenuItem;

  // [key: string]: string | number;
}
export interface IMenusModelState {
  list: IMenuItem[];
  original: IMenuItem[]
}

export interface IMenusModel {
  namespace: string;
  state: IMenusModelState;
  effects: {
    getMenu: Effect;
  };
  reducers: {
    setMeunList: Reducer<IMenusModelState>;
    addPreViewMenu: Reducer<IMenusModelState>;
    destory: Reducer<IMenusModelState>;
  };
}
const inintState = {
  list: [],
  original: []
};
const MenusModel: IMenusModel = {
  namespace: 'menus',

  state: inintState,

  effects: {
    * getMenu({ payload }, { call, put }) {
      const response = yield call(queryMenuList, payload);
      if (response?.code === 0) {
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
      const tempData = JSON.parse(JSON.stringify(payload));
      const list: IMenuItem[] = construct(tempData, {
        attribute: {
          page: ROUTER_SUFFIX
        },
        mapping: {
          pageId: "pageLink",
        }
      }) as IMenuItem[];
      state.list = [...state.list, ...list];
      state.original = payload;
      return state;
    },
    addPreViewMenu(state: IMenusModelState = inintState, { payload }): IMenusModelState {
      const findMenu = state.list.find((item) => item.id === MODE_PREVIEW);
      if (!findMenu) {
        state.list.push(payload);
      }
      return state;
    },
    destory(state: IMenusModelState = inintState, { payload }): IMenusModelState {
      state = inintState;
      return state;
    }
  },
};

export default MenusModel;
