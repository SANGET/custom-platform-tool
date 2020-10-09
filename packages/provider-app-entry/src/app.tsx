import React from "react";

import {
  MultipleRouterManager, Link,
  defaultState as defaultRouteState,
  RouterState, RouterHelperProps, onNavigate,
  resolvePagePathWithSeperator, redirectToRoot, setDefaultParams
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

export interface AppContainerState extends RouterState {
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
  if (app) {
    $R_P.urlManager.setApp(app);
  }
};

export interface AppLocationState {
  /** 选择的应用 */
  app: string
  /** 登录的租户 */
  lessee: string
  /**  */
  pageID: string
}

export default class App extends MultipleRouterManager<AppContainerProps, AppContainerState, AppLocationState> {
  state: AppContainerState = defaultRouteState

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      ready: false,
      navMenu: [],
    };
  }

  resolveAppFromUrl = () => {

  }

  /**
   * 初始化路由配置
   */
  initRouteForApp = (nextState) => {
    const selectedApp = this.appLocation?.app;
    if (!selectedApp) {
      redirectToRoot();
    } else {
      setReqUrlByApp(selectedApp);
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

  // handleHistoryChange = (activeRoute) => {
  //   setReqUrlByApp(this.appLocation.state?.app);
  //   // console.log(this.state.activeRoute);
  // }

  getRouteItem = (pathname) => Router[pathname]

  /** 是否进入了应用 */
  isEntryApp = () => this.state.routers.length > 0

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
            const { pathname, pathSnapshot: pageKey } = pageItemInfo;
            const pageDOMID = pathname.replace('/', '');

            /**
             * 从路由配置中找到 pagePath 对应的页面
             */
            const routeConfig = this.getRouteItem(resolvePagePathWithSeperator(pagePath));
            const Child = routeConfig?.component;

            return (
              <PageContainer
                pagePath={pagePath}
                pageAuthInfo={pageAuthInfo}
                appContext={this.appContext}
                appLocation={this.appLocation}
                className="page"
                key={pageKey}
                id={pageDOMID}
                style={{
                  display: isShow ? 'block' : 'none'
                }}
                ChildComp={Child}
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
    const isShowMainNav = this.isEntryApp();
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

    const isEntryApp = this.isEntryApp();

    return (
      <div id="provider_app_container" className="bg-gray-100">
        {
          ready ? (
            <>
              <header
                id="provider_app_header"
                className={`provider-app-header bg-white flex items-center content-center shadow ${isEntryApp ? 'has-app' : ''}`}
              >
                <Logo
                  onClick={(e) => {
                    this.closeAll();
                  }}
                />
                {this.renderNav()}
                <span className="flex"></span>
                {
                  // 需要选择应用后才进入应用
                  isEntryApp && <ToApp appLocation={this.appLocation} />
                }
                <UserStatusbar logout={logout} />
              </header>
              <div id="provider_app_content">
                {
                  !isEntryApp ? (
                    <Dashboard
                      onSelectApp={({ app }) => {
                        setReqUrlByApp(app);
                        setDefaultParams({
                          app,
                        });
                      }}
                    />
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
