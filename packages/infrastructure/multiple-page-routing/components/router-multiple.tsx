import React, { Component } from "react";

import { getUrlParams, UrlParamsRes } from "@mini-code/request/url-resolve";
import { RemoveArrayItem, Call } from "@mini-code/base-func";

import {
  history,
  wrapPushUrl,
  pushToHistory,
  replaceHistory,
  getRouteKey,
  onNavigate,
} from "../utils";

export interface RouterHelperProps {
  /** 是否缓存 state */
  cacheState?: boolean;
  /** 最大共存路由 */
  maxRouters: number;
}

export interface RouteParams {
  _R?: string;
  [RouteName: string]: any;
}

export interface RouterEntity {
  [propName: string]: {
    params: RouteParams;
  };
}

export interface RouterState {
  routers: string[];
  routerInfo: RouterEntity;
  activeRouteIdx: number;
  activeRoute: string;
}

const defaultState: RouterState = {
  routers: [],
  routerInfo: {},
  activeRouteIdx: -1,
  activeRoute: "",
};
let cachedState = Object.assign({}, defaultState);

const getAllUrlParams = () => {
  const res = getUrlParams(undefined, undefined, true);
  const nextRes: {} =
    typeof res === "string"
      ? {
          _R: res,
        }
      : {
          ...res,
        };
  return nextRes;
};

class RouterHelper<
  P extends RouterHelperProps,
  S extends RouterState
> extends Component<P, S> {
  history = history;

  wrapPushUrl: Function = wrapPushUrl;

  pushToHistory: Function = pushToHistory;

  onNavigate: Function = onNavigate;

  unlisten: Function | null = null;

  defaultPath: string | null = null;

  handlePop!: () => void;

  handlePush!: () => void;

  constructor(props) {
    super(props);

    const { cacheState } = props;

    if (this.unlisten) this.unlisten();
    this.unlisten = history.listen(this.handleHistory);

    this.state = cacheState ? cachedState : defaultState;
  }

  componentDidMount() {
    this.initRoute();
  }

  changeRoute = (route: string, params) => {
    onNavigate({
      type: "PUSH",
      route,
      params,
    });
  };

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
    // const activeRoute = resolvePath(hash)[0];
    const activeRoute = getAllUrlParams()[getRouteKey()];
    const nextRouterState = state.nextRouters;
    this.selectTab(activeRoute, nextRouterState);
  };

  closeAll = () => {
    replaceHistory("/");
    this.setState((prevState) => ({
      ...prevState,
      ...defaultState,
    }));
  };

  closeTab = (idx: number) => {
    const { routers, routerInfo, activeRouteIdx } = this.state;

    const targetRoute = routers[idx];
    const nextRouters = [...routers].remove(targetRoute);
    const nextRouterInfo = { ...routerInfo };
    delete nextRouterInfo[targetRoute];
    const nextRoutersLen = nextRouters.length - 1;
    const nextActiveIdx =
      activeRouteIdx > nextRoutersLen ? nextRoutersLen : activeRouteIdx;
    const nextActiveRoute = nextRouters[nextActiveIdx];

    if (!nextActiveRoute) return this.closeAll();

    const nextRouterParams = nextRouterInfo[nextActiveRoute] || {};

    const nextState = {
      routers: nextRouters,
      routerInfo: nextRouterInfo,
      activeRoute: nextActiveRoute,
      activeRouteIdx: nextActiveIdx,
    };

    // pushToHistory(`#/${nextActiveRoute}`, {
    //   type: 'CLOSE',
    //   component: nextActiveRoute,
    //   params: nextRouterInfo,
    //   nextRouters: nextState
    // });
    const config = {
      type: "PUSH",
      route: nextActiveRoute,
      params: nextRouterParams.params,
      nextRouters: nextState,
    };
    // pushToHistory(wrapPushUrl(config), config);
    onNavigate(config);

    return nextState;
  };

  selectTab = (
    activeRoute: string,
    nextRouterState?: RouterState
  ): void | null => {
    if (nextRouterState) return this.setState(nextRouterState);
    if (!activeRoute) return null;

    return this.setState(({ routers, routerInfo }) => {
      const { maxRouters } = this.props;
      const currComIdx = routers.indexOf(activeRoute);
      let nextRouters = [...routers];
      const nextRouterInfo = { ...routerInfo };
      const currParams = getAllUrlParams();
      nextRouterInfo[activeRoute] = {
        ...(nextRouterInfo[activeRoute] || {}),
        params: currParams,
      };
      let activeIdx = currComIdx;
      if (currComIdx === -1) {
        nextRouters = [...routers, activeRoute];
        /** 做最大路由控制 */
        if (nextRouters.length > maxRouters) {
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
        routerInfo: nextRouterInfo,
      };
      cachedState = nextState;
      return nextState;
    });
  };

  initRoute = () => {
    // let initRoute = resolvePath(location.hash)[0];
    const { defaultPath } = this;
    // const initRoute = getUrlParams()[getRouteKey()];
    defaultPath &&
      onNavigate({
        type: "PUSH",
        route: defaultPath,
      });
    // if (!initRoute && defaultPath) {
    //   onNavigate({
    //     type: 'PUSH',
    //     route: defaultPath
    //   });
    // } else {
    //   this.selectTab(initRoute);
    // }
  };
}

export default RouterHelper;
