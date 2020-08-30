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

interface AppContainerState extends RouterState {
  ready?: boolean;
  navStore?: any[];
  preparingPage?: boolean;
}

interface AppContainerProps extends RouterHelperProps {
  onLoad?: () => void;
}

const pageCache = {};
const pageAuthCache = {};

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

  componentDidMount() {
    GetMenu().then((menuData) => {
      this.setState({
        navStore: menuData,
        ready: true
      });

      this.initRoute();
    });
  }

  componentDidCatch(e) {
    console.log(e);
  }

  appContext = {
    location: this.history.location,
    onNavigate: this.onNavigate
  }

  render() {
    const {
      routers, routerInfo, activeRouteIdx, activeRoute,
      navStore, ready
    } = this.state;

    return (
      <div id="provider_app_container">
        {
          ready ? (
            <>
              <header className="header layout a-c-c">
                <Logo />
                <Nav navConfig={navStore} />
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
                <div className="pages-container">
                  {
                    Object.keys(routerInfo).map((pageID, idx) => {
                      const pageItemInfo = routerInfo[pageID];
                      const pageAuthInfo = pageAuthCache[pageID];
                      const isShow = pageID === activeRoute;
                      const pageKey = pageID;

                      // TODO: 优化加载页面
                      const C = router[pageID] || 'div';

                      return (
                        <PageContainer
                          pageID={pageID}
                          pageAuthInfo={pageAuthInfo}
                          appContext={this.appContext}
                          className="page"
                          key={pageKey}
                          id={pageID}
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
