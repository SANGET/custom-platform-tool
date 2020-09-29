import React from "react";

import {
  MultipleRouterManager, Link,
  defaultState as defaultRouteState,
  RouterState, RouterHelperProps, onNavigate,
  resolvePagePathWithSeperator
} from 'multiple-page-routing';

/** 获取路由配置 */
import { Dashboard } from "@provider-app/dashboard/main";
import Router, { getRouteName } from '@provider-app/config/router';
import { LoadingTip } from "@hy/loading-tip";

import {
  // Hall,
  PageContainer, Nav, TabNav, Logo, UserStatusbar
} from './components';

import { AuthStoreState } from "./auth/actions";

import { GetMenu } from "./apis";
import { ToApp } from "./components/ToApp";

interface AppContainerState extends RouterState {
  ready?: boolean;
  navMenu?: any[];
  preparingPage?: boolean;
}

interface AppContainerProps extends RouterHelperProps, AuthStoreState {
  onLoad?: () => void;
}

const pageCache = {};
const pageAuthCache = {};

const setReqUrlByApp = (app) => {
  // console.log(this.location);
  if (app) {
    $R_P.urlManager.setApp(app);
  }
};

export default class App extends MultipleRouterManager<AppContainerProps, AppContainerState> {
  state: AppContainerState = defaultRouteState

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      ready: false,
      navMenu: [],
    };
  }

  /**
   * 初始化路由配置
   */
  initRouteForApp = (nextState) => {
    const initRouteInfo = this.getUrlParams(undefined, undefined, true);
    const appParams = initRouteInfo.app;
    if (!appParams) {
      this.history.replace('/');
    } else {
      setReqUrlByApp(appParams);
      this.initRoute();
    }

    nextState && this.setState(nextState);
  };

  componentDidMount() {
    GetMenu().then((menuData) => {
      // this.setState();

      this.initRouteForApp({
        navMenu: menuData,
        ready: true
      });
    });
  }

  componentDidCatch(e) {
    // console.log(e);
    const { logging } = this.props;
  }

  handleHistoryChange = (activeRoute) => {
    setReqUrlByApp(this.location.app);
    // console.log(this.state.activeRoute);
  }

  getRouteItem = (pathname) => Router[pathname]

  hasPage = () => this.state.routers.length > 0

  appContext = {
    history: this.history,
    onNavigate: this.onNavigate
  }

  renderPages = () => {
    const {
      routers, routerSnapshot, activeRoute,
    } = this.state;
    // console.log(this.state);

    return (
      <div className="pages-container">
        {
          Object.keys(routerSnapshot).map((pagePath, idx) => {
            const pageItemInfo = routerSnapshot[pagePath];
            const pageAuthInfo = pageAuthCache[pagePath];
            const isShow = pagePath === activeRoute;
            const pageKey = pageItemInfo.pathSnapshot;

            /**
             * 从路由配置中找到 pagePath 对应的页面
             */
            const routeConfig = this.getRouteItem(resolvePagePathWithSeperator(pagePath));
            const C = routeConfig?.component;

            return (
              <PageContainer
                pagePath={pagePath}
                pageAuthInfo={pageAuthInfo}
                appContext={this.appContext}
                location={this.location}
                className="page"
                key={pageKey}
                style={{
                  display: isShow ? 'block' : 'none'
                }}
                ChildComp={C}
              >
              </PageContainer>
            );
          })
        }
      </div>
    );
  }

  /**
   * 渲染导航栏
   * 策略：
   * 1. 需要进入了应用才显示导航栏
   */
  renderNav = () => {
    const {
      navMenu, ready,
    } = this.state;
    /**
     * 是否选择了应用，必须选择应用后才现实菜单
     */
    const isShowMainNav = this.hasPage();
    return isShowMainNav ? (
      <Nav
        navConfig={navMenu}
      />
    ) : null;
  }

  render() {
    const { logout } = this.props;
    const {
      routers, routerSnapshot, activeRoute,
      navMenu, ready,
    } = this.state;

    const hasPage = this.hasPage();

    return (
      <div id="provider_app_container" className="bg-gray-100">
        {
          ready ? (
            <>
              <header className="header flex items-center content-center">
                <Logo
                  onClick={(e) => {
                    this.closeAll();
                  }}
                />
                {this.renderNav()}
                <span className="flex"></span>
                {
                  // 需要选择应用后才进入应用
                  hasPage && <ToApp location={this.location} />
                }
                <UserStatusbar logout={logout} />
              </header>
              <div id="provider_app_content">
                {
                  !hasPage ? (
                    <Dashboard {...this.appContext} />
                  ) : (
                    <>
                      <TabNav
                        onClose={(idx) => {
                          this.closeTab(idx);
                        }}
                        routers={routers}
                        routerSnapshot={routerSnapshot}
                        activeRoute={activeRoute}
                        getRouteName={getRouteName}
                      />
                      {this.renderPages()}
                    </>
                  )
                }
              </div>
            </>
          ) : (
            <LoadingTip />
          )
        }
      </div>
    );
  }
}
