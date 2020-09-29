import React, { Component } from "react";
import produce from "immer";

import { getUrlParams } from "@mini-code/request/url-resolve";
import { Call } from "@mini-code/base-func";

import {
  history,
  wrapPushUrl,
  pushToHistory,
  replaceHistory,
  onNavigate,
  resolvePagePath,
  resolvePagePathWithSeperator, getPathname
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

export const defaultState: RouterState = {
  routers: [],
  routerSnapshot: {},
  activeRouteIdx: -1,
  activeRoute: "",
};
let cachedState = Object.assign({}, defaultState);

const getAllUrlParams = () => {
  const res = getUrlParams(undefined, undefined, true);
  return res;
};

class MultipleRouterManager<
  P extends RouterHelperProps,
  S extends RouterState
> extends Component<P, S> {
  history = history

  wrapPushUrl = wrapPushUrl

  pushToHistory = pushToHistory

  onNavigate = onNavigate

  getUrlParams = getUrlParams

  unlisten

  defaultPath: string | null = null

  handlePop!: () => void

  handlePush!: () => void

  handleHistoryChange!: (activeRoute: string) => void

  location = history.location

  constructor(props) {
    super(props);

    const { cacheState } = props;

    if (this.unlisten) this.unlisten();
    this.unlisten = history.listen(this.handleHistory);

    this.state = cacheState ? cachedState : defaultState;
    this.setLocation(history.location);
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

  setLocation = (location: typeof history.location, extend = {}) => {
    const { hash } = location;
    const pagePath = resolvePagePath(hash);
    const pagePathWithDetail = resolvePagePathWithSeperator(hash);
    const params = getAllUrlParams();
    this.location = produce(location, (draft) => {
      return {
        ...draft,
        ...params,
        pagePath,
        pagePathWithDetail
      };
    });
  }

  handleHistory = (location, action) => {
    switch (action) {
      case "POP":
        Call(this.handlePop);
        break;
      case "PUSH":
        Call(this.handlePush);
        break;
    }
    const { hash, state = {} } = location;
    const activePath = resolvePagePath(hash);
    const nextRouterState = state.nextRoutersFromState;

    this.setLocation(location);
    this.selectTab(activePath, nextRouterState);

    // hook 函数
    Call(this.handleHistoryChange, activePath);
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
    delete nextRouterInfo[targetRoute];
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
      nextRoutersFromState: nextState,
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
          delete nextRouterInfo[target];
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
    const { pagePath } = this.location;
    const initRouteInfo = getUrlParams(undefined, undefined, true);
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
