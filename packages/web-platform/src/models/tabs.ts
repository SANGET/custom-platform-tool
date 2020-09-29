import { Reducer, history } from 'umi';
import { getQueryByParams } from '@/utils/utils';
import { stringify } from 'querystring';

export enum TAB_TYPE {
  /** 动态菜单获取的界面 */
  PAGE,
  /** 内置路由对应的界面 */
  BUILT_IN
}

export enum TABS_OPERATION {
  /** 关闭单前页面 */
  CLOSE_PREVIOUS_PAGE,
  /** 关闭其他页面 */
  CLOSE_OTHER_PAGE,

  /** 关闭所有界面 */
  CLOSE_ALL_PAGE,
}
export interface ITabsItem {
  /** 显示名称 */
  title: string;
  /** 对应路由地址 */
  path: string;
  /** 类型判断 主要区分首页和动态加载的路由 */
  /** tabs 是否可以关闭 */
  closable?: boolean;

  pageId?: string;
  /** 菜单ID */
  menuId?: string;
  mode?: string;
  app?: string;
  lessee?: string;

}
export interface ITabsModelState {
  list: ITabsItem[];
  activeKey: string;

  openKeys: string[];

  maxTabs: number;
}

export interface ITabsModel {
  namespace: string;
  state: ITabsModelState;
  effects: {

  };
  reducers: {
    add: Reducer<ITabsModelState>;
    remove: Reducer<ITabsModelState>;
    updata: Reducer<ITabsModelState>;
    close: Reducer<ITabsModelState>;
    destory: Reducer<ITabsModelState>;
  };
}

const inintState: ITabsModelState = {
  list: [{
    title: "首页",
    path: "/dashboard",
    closable: false,
    menuId: "/dashboard"
  }],
  activeKey: "/dashboard",
  maxTabs: 8,
  openKeys: []
};

const TabsModel: ITabsModel = {
  namespace: 'tabs',

  state: inintState,

  effects: {

  },

  reducers: {
    /** 新增tabs 主要是点击菜单 */
    add(state: ITabsModelState = inintState, { payload }): ITabsModelState {
      const {
        title, path, closable = true, pageId, menuId, mode, app, lessee
      } = payload;
      const { list } = state;
      const findSameTab = list.find((tab) => tab.menuId === menuId);
      // 如果 tabs 达到最大值,新打开的menu 覆盖最后一个tabs
      if (!findSameTab && state.list.length === state.maxTabs) {
        list[state.maxTabs - 1] = {
          title, path, menuId, closable, pageId, mode, app, lessee
        };
      } else if (!findSameTab) {
        list.push({
          title, path, menuId, closable, pageId, mode, app, lessee
        });
      } else {
        const findIndex = list.findIndex((tab) => tab.menuId === menuId);
        list[findIndex] = {
          ...payload,
          ...list[findIndex],
        };
      }
      state.activeKey = menuId;
      state.list = list;
      return state;
    },
    /** 关闭tabs  */
    remove(state: ITabsModelState = inintState, { payload }): ITabsModelState {
      const index = state.list.findIndex((tab) => tab.menuId === payload);
      const filterTabs = state.list.filter((tab) => tab.menuId !== payload);
      const currentIndex = index > 0 ? index - 1 : 0;
      state.list = filterTabs;
      const {
        menuId, pageId, path, mode, app, lessee
      } = filterTabs[currentIndex];
      state.activeKey = menuId || "";
      const queryLink = getQueryByParams(["mode", "app", "lessee"]);
      // const queryString = stringify({
      //   path: state.activeKey,
      //   mode,
      //   app,
      //   lessee,
      //   pageId
      // });
      const link = `${path}?menuId=${menuId}&${queryLink}&pageId=${pageId}`;
      history.push(link);
      return state;
    },
    /** tabs 右侧操作栏关闭事件 */
    close(state:ITabsModelState = inintState, { payload }): ITabsModelState {
      const queryLink = getQueryByParams(["mode", "app", "lessee"]);
      if (payload === TABS_OPERATION.CLOSE_ALL_PAGE) {
        state.list = inintState.list;
        if (state.activeKey !== inintState.activeKey) {
          state.activeKey = inintState.activeKey;
          history.push(`${state.activeKey}?${queryLink}`);
        }
      } else if (payload === TABS_OPERATION.CLOSE_OTHER_PAGE) {
        const filterList = state.list.filter((item) => item.menuId === state.activeKey);
        state.list = [...inintState.list, ...filterList];
      } else if (payload === TABS_OPERATION.CLOSE_PREVIOUS_PAGE) {
        const filterList = state.list.filter((item) => item.menuId !== state.activeKey);
        const findIndex = state.list.findIndex((item) => item.menuId === state.activeKey);
        state.list = filterList;
        const { path, menuId } = filterList[findIndex - 1];
        state.activeKey = menuId || "";
        history.push(`${path}?${queryLink}`);
      }
      return state;
    },
    /** 点击tabs 更新  */
    updata(state: ITabsModelState = inintState, { payload }): ITabsModelState {
      const queryLink = getQueryByParams(["mode", "app", "lessee"]);
      const findTab = state.list.find((tab) => tab.menuId === payload) as ITabsItem;
      const {
        path, menuId, pageId
      } = findTab;
      const link = `${path}?menuId=${menuId}&${queryLink}&pageId=${pageId}`;
      history.push(link);
      state.activeKey = payload;
      return state;
    },
    /** */
    destory(state: ITabsModelState = inintState, { payload }): ITabsModelState {
      state = inintState;
      return state;
    }
  },
};

export default TabsModel;
