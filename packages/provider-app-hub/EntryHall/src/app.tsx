import React from "react";

import {
  RouterMultiple, Link,
  defaultState as defaultRouteState,
  RouterState, RouterHelperProps, onNavigate
} from 'multiple-page-routing';

import { GetMenu } from './services/menu';
import { PageContainer, Nav } from './components';
import router from './config/router';

import { TabNav } from "./components/TabNav";
import { Logo } from "./components/Logo";
import { UserStatusbar } from "./components/UserStatusbar";
import { AuthStoreState } from "./auth/actions";
import Hall from './Hall';

interface AppContainerState extends RouterState {
  ready?: boolean;
  navStore?: any[];
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
      navStore: [],
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
        navStore: menuData,
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
      navStore, ready,
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
            const C = router[pagePath.split('?')[0]] || 'div';

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
                {/* {
                  (pageContext) => {
                    console.log('asd');
                    return (
                      <C
                        {...pageContext}
                      />
                    );
                  }
                } */}
              </PageContainer>
            );
          })
        }
      </div>
    ) : (
      <Hall
        appContext={this.appContext}
        location={this.location}
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
      navStore, ready,
    } = this.state;
    const hasPage = routers.length > 0;
    return hasPage ? (
      <Nav navConfig={navStore} />
    ) : null;
  }

  render() {
    const { logout } = this.props;
    const {
      routers, routerInfo, activeRoute,
      navStore, ready,
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
