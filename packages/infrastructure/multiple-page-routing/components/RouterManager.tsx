import React, { Component } from "react";
import produce from "immer";

import { getUrlSearchParams } from "@mini-code/request/url-resolve";
import { Call } from "@mini-code/base-func";

import { UnregisterCallback, Location } from "history";
import {
  history,
  wrapPushUrl,
  pushToHistory,
  replaceHistory,
  onNavigate,
  resolvePagePath,
  resolvePagePathWithSeperator,
  getPathname
} from "../utils";

export interface RouterHelperProps {
  /** 是否缓存 state */
  cacheState?: boolean;
  /** 最大共存路由 */
  maxRouters?: number;
}

export interface RouteParams {
  [RouteName: string]: any;
}

export interface RouterSnapshot {
  [propName: string]: {
    /** 记录该路由的 queryString */
    params: RouteParams
    /** 当前路径的快照 */
    pathSnapshot: string
    /** pathname */
    pathname: string
  };
}

export interface RouterState {
  /** 用于存储路由列表 */
  routers: string[];
  /** 用于存储当前路由的相关信息的快照 */
  routerSnapshot: RouterSnapshot;
  /** 当前激活的路由 index */
  activeRouteIdx: number;
  /** 当前激活的路由名 */
  activeRoute: string;
}

export interface DefaultLocationState {
  /** 通过 hash 存储的页面路径 */
  pagePath?: string
  /** 通过 hash 存储的页面路径，包含分隔符 */
  pagePathWithDetail?: string
}

export const defaultState: RouterState = {
  routers: [],
  routerSnapshot: {},
  activeRouteIdx: -1,
  activeRoute: "",
};

let cachedState = Object.assign({}, defaultState);

const getAllUrlParams = () => {
  const res = getUrlSearchParams({
    fromBase64: true
  });
  return res;
};

class MultipleRouterManager<
  P extends RouterHelperProps,
  S extends RouterState,
  L = unknown,
> extends Component<P, S> {
  history = history

  onNavigate = onNavigate

  unlisten!: UnregisterCallback

  defaultPath: string | null = null

  /** 响应浏览器 pop 的回调 */
  onPop!: () => void

  /** 响应浏览器 push 的回调 */
  onPush!: () => void

  handleHistoryChange!: (activeRoute: string) => void

  appLocation: Location<L> & DefaultLocationState = history.location

  constructor(props) {
    super(props);

    const { cacheState } = props;

    if (this.unlisten) this.unlisten();
    this.unlisten = history.listen(this.locationListener);

    this.state = cacheState ? cachedState : defaultState;
    this.setLocation(history.location);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  componentDidMount() {
    this.initRoute();
  }

  redirect = () => {

  }

  changeRoute = (path: string, params) => {
    onNavigate({
      type: "PUSH",
      path,
      params,
    });
  };

  /**
   * 设置 location 对象，挂载属性
   * @param location next location
   * @param extend 给 location 的扩展
   */
  setLocation = (location: typeof history.location, extend = {}) => {
    const { hash } = location;
    const pagePath = resolvePagePath(hash);
    const pagePathWithDetail = resolvePagePathWithSeperator(hash);
    const params = getAllUrlParams();
    this.appLocation = produce(location, (draft) => {
      return {
        ...draft,
        ...params,
        pagePath,
        pagePathWithDetail
      };
    });
  }

  locationListener = (location, action) => {
    /** 触发时机在 location 更改完成后 */
    // setTimeout(() => {
    switch (action) {
      case "POP":
        Call(this.onPop);
        break;
      case "PUSH":
        Call(this.onPush);
        break;
    }
    const { hash, state = {} } = location;
    const activePath = resolvePagePath(hash);
    this.setLocation(location);
    const nextRouterState = state.nextRoutersFromState;
    this.selectTab(activePath, nextRouterState);

    // hook 函数
    Call(this.handleHistoryChange, activePath);
    // });
  };

  closeAll = () => {
    replaceHistory("/");
    this.setState((prevState) => ({
      ...prevState,
      ...defaultState,
    }));
  };

  closeTab = (idx: number) => {
    const { routers, routerSnapshot, activeRouteIdx } = this.state;

    const targetRoute = routers[idx];
    const nextRouters = [...routers].remove(targetRoute);
    const nextRouterInfo = { ...routerSnapshot };
    // delete nextRouterInfo[targetRoute];
    Reflect.deleteProperty(nextRouterInfo, targetRoute);
    const nextRoutersLen = nextRouters.length - 1;
    const nextActiveIdx = activeRouteIdx > nextRoutersLen ? nextRoutersLen : activeRouteIdx;
    const nextActiveRoute = nextRouters[nextActiveIdx];

    if (!nextActiveRoute) return this.closeAll();

    const nextRouterParams = nextRouterInfo[nextActiveRoute] || {};

    const nextState = {
      routers: nextRouters,
      routerSnapshot: nextRouterInfo,
      activeRoute: nextActiveRoute,
      activeRouteIdx: nextActiveIdx,
    };

    // pushToHistory(`#/${nextActiveRoute}`, {
    //   type: 'CLOSE',
    //   component: nextActiveRoute,
    //   params: nextRouterInfo,
    //   nextRouters: nextState
    // });

    // pushToHistory(wrapPushUrl(config), config);
    onNavigate({
      type: "PUSH",
      path: nextActiveRoute,
      params: nextRouterParams.params,
      // 给关闭当前 tab 候使用的 route state
      state: {
        nextRoutersFromState: nextState,
      }
    });

    return nextState;
  };

  selectTab = (
    activeRoute: string,
    nextRouterState?: RouterState,
    mergeState = {}
  ): void | null => {
    if (nextRouterState) return this.setState(nextRouterState);
    if (!activeRoute) return null;

    return this.setState(({ routers, routerSnapshot }) => {
      const { maxRouters } = this.props;
      const currComIdx = routers.indexOf(activeRoute);
      let nextRouters = [...routers];
      const nextRouterInfo = { ...routerSnapshot };
      const currParams = getAllUrlParams();
      const pathSnapshot = window.location.hash;
      const pathname = resolvePagePathWithSeperator(pathSnapshot);
      nextRouterInfo[activeRoute] = {
        ...(nextRouterInfo[activeRoute] || {}),
        pathSnapshot,
        pathname,
        params: currParams,
      };
      let activeIdx = currComIdx;
      if (currComIdx === -1) {
        nextRouters = [...routers, activeRoute];
        /** 做最大路由控制 */
        if (maxRouters && nextRouters.length > maxRouters) {
          const [target, ...other] = nextRouters;
          nextRouters = other;
          Reflect.deleteProperty(nextRouterInfo, target);
        }
        activeIdx = nextRouters.length - 1;
      }
      const nextState = {
        activeRoute,
        activeRouteIdx: activeIdx,
        routers: nextRouters,
        routerSnapshot: nextRouterInfo,
        ...mergeState
      };
      cachedState = nextState;
      return nextState;
    });
  };

  initRoute = () => {
    // let initRoute = resolvePagePath(location.hash)[0];
    const { defaultPath } = this;
    // console.log(this.location);
    const pagePath = resolvePagePath(this.appLocation.hash);
    const initRouteInfo = getUrlSearchParams({
      fromBase64: true
    });
    const initRoute = pagePath;

    defaultPath
      && onNavigate({
        type: "PUSH",
        path: defaultPath,
      });
    initRoute
      && onNavigate({
        type: "PUSH",
        path: initRoute,
        params: initRouteInfo
      });
    // if (!initRoute && defaultPath) {
    //   onNavigate({
    //     type: 'PUSH',
    //     path: defaultPath
    //   });
    // } else {
    //   this.selectTab(initRoute);
    // }
  };
}

export default MultipleRouterManager;
