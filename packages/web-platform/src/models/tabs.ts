import { Reducer, history } from 'umi';
import { ROUTER_SUFFIX } from '@/constant';

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
export interface ITabsList {
  /** 显示名称 */
  title: string;
  /** 对应路由地址 */
  path: string;
  /** 类型判断 主要区分首页和动态加载的路由 */
  page: TAB_TYPE;
  /** tabs 是否可以关闭 */
  closable?: boolean;

}
export interface ITabsModelState {
  list: ITabsList[];
  activeKey: string;

  openKeys: string[];

  maxTabs: number;
}
const goToRouter = (page: TAB_TYPE, link: string) => {
  if (page === TAB_TYPE.PAGE) {
    history.push(`${ROUTER_SUFFIX}?path=${link}`);
  } else {
    history.push(link);
  }
};
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
    page: TAB_TYPE.BUILT_IN,
    closable: false
  }],
  activeKey: "/dashboard",
  maxTabs: 5,
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
      const { title, path, closable = true } = payload;
      const { activeKey, list } = state;
      const findSameTab = list.find((tab) => tab.path === path);
      const page = history.location.pathname === ROUTER_SUFFIX ? TAB_TYPE.PAGE : TAB_TYPE.BUILT_IN;
      if (state.list.length === state.maxTabs) {
        const findCurrent: number = list.findIndex((tab) => tab.path === activeKey);
        if (!findSameTab) {
          list[findCurrent] = {
            title, path, page, closable
          };
        }
      } else if (!findSameTab) {
        list.push({
          title, path, page, closable
        });
      }
      state.activeKey = path;
      state.list = list;
      return state;
    },
    /** 关闭tabs  */
    remove(state: ITabsModelState = inintState, { payload }): ITabsModelState {
      const index = state.list.findIndex((tab) => tab.path === payload);
      const filterTabs = state.list.filter((tab) => tab.path !== payload);
      const currentIndex = index > 0 ? index - 1 : 0;
      state.list = filterTabs;
      if (filterTabs.length > 0) {
        state.activeKey = filterTabs[currentIndex].path || "";
        goToRouter(filterTabs[currentIndex].page, state.activeKey);
      }
      return state;
    },
    /** tabs 右侧操作栏关闭事件 */
    close(state:ITabsModelState = inintState, { payload }): ITabsModelState {
      if (payload === TABS_OPERATION.CLOSE_ALL_PAGE) {
        state.list = inintState.list;
        if (state.activeKey !== inintState.activeKey) {
          state.activeKey = inintState.activeKey;
          history.push(state.activeKey);
        }
      } else if (payload === TABS_OPERATION.CLOSE_OTHER_PAGE) {
        const filterList = state.list.filter((item) => item.path === state.activeKey);
        state.list = [...inintState.list, ...filterList];
      } else if (payload === TABS_OPERATION.CLOSE_PREVIOUS_PAGE) {
        const filterList = state.list.filter((item) => item.path !== state.activeKey);
        state.list = filterList;
        state.activeKey = inintState.activeKey;
        history.push(state.activeKey);
      }
      return state;
    },
    /** 点击tabs 更新  */
    updata(state: ITabsModelState = inintState, { payload }): ITabsModelState {
      state.activeKey = payload;
      return state;
    },
    /** */
    destory(state: ITabsModelState = inintState, { payload }): ITabsModelState {
      return inintState;
    }
  },
};

export default TabsModel;
