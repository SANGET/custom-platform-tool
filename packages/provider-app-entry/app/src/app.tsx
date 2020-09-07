import React from "react";

import {
  RouterMultiple, Link,
  defaultState as defaultRouteState,
  RouterState, RouterHelperProps, onNavigate
} from 'multiple-page-routing';

/** 获取路由配置 */
import router, { getRouteName, resolvePath } from '@provider-app/config/router';

import {
  Hall,
  PageContainer, Nav, TabNav, Logo, UserStatusbar
} from './components';

import { AuthStoreState } from "./auth/actions";

import { GetMenu } from "./apis";

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

export default class App extends RouterMultiple<AppContainerProps, AppContainerState> {
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
  initRouteForApp = () => {
    const initRouteInfo = this.getUrlParams(undefined, undefined, true);
    const appParams = initRouteInfo.app;
    if (!appParams) {
      this.history.replace('/');
    } else {
      setReqUrlByApp(appParams);
      this.initRoute();
    }
  };

  componentDidMount() {
    GetMenu().then((menuData) => {
      this.setState({
        navMenu: menuData,
        ready: true
      });

      this.initRouteForApp();
    });
  }

  handleHistoryChange = () => {
    setReqUrlByApp(this.location.app);
  }

  componentDidCatch(e) {
    // console.log(e);
    const { logging } = this.props;
  }

  appContext = {
    history: this.history,
    onNavigate: this.onNavigate
  }

  renderPages = () => {
    const {
      routers, routerInfo, activeRoute,
    } = this.state;

    const hasPage = routers.length > 0;

    return hasPage ? (
      <div className="pages-container">
        {
          Object.keys(routerInfo).map((pagePath, idx) => {
            const pageItemInfo = routerInfo[pagePath];
            const pageAuthInfo = pageAuthCache[pagePath];
            const isShow = pagePath === activeRoute;
            const pageKey = pagePath;

            /**
             * 从路由配置中找到 pagePath 对应的页面
             */
            const routeConfig = router[resolvePath(pagePath)];
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
    ) : (
      <Hall
        location={this.location}
        onNavigate={this.onNavigate}
      />
    );
  }

  /**
   * 渲染导航栏
   * 策略：
   * 1. 需要进入了应用才显示导航栏
   */
  renderNav = () => {
    const {
      routers, routerInfo, activeRoute,
      navMenu, ready,
    } = this.state;
    const hasPage = routers.length > 0;
    return hasPage ? (
      <Nav
        navConfig={navMenu}
      />
    ) : null;
  }

  render() {
    const { logout } = this.props;
    const {
      routers, routerInfo, activeRoute,
      navMenu, ready,
    } = this.state;

    return (
      <div id="provider_app_container">
        {
          ready ? (
            <>
              <header className="header layout a-i-c a-c-c">
                <Logo
                  onClick={(e) => {
                    this.closeAll();
                  }}
                />
                {this.renderNav()}
                <span className="flex"></span>
                <UserStatusbar logout={logout} />
              </header>
              <div id="provider_app_content">
                <TabNav
                  onClose={(idx) => {
                    this.closeTab(idx);
                  }}
                  routers={routers}
                  routerInfo={routerInfo}
                  activeRoute={activeRoute}
                  getRouteName={getRouteName}
                />
                {this.renderPages()}
              </div>
            </>
          ) : (
            <div>Loading</div>
          )
        }
      </div>
    );
  }
}
