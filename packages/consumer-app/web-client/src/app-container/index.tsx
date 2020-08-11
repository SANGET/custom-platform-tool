import React from 'react';

import {
  RouterMultiple, Link,
  defaultState as defaultRouteState,
  RouterState, RouterHelperProps
} from 'multiple-page-routing';

/** Components */
import IUBDSLParser from '@iub-dsl/parser/engin';
import Nav from "./nav";
import PageContainer from '../page-container';

/** API */
import { GetMenu } from '../services/menu';
import { GetPageAuthConfig, AuthUIByUIID } from '../services/auth';
import { LoadPage } from '../services/access';

interface AppContainerState extends RouterState {
  ready?: boolean;
  navStore?: [];
  preparingPage?: boolean;
}

interface AppContainerProps extends RouterHelperProps {
  onLoad: () => void;
}

const pageCache = {};
const pageAuthCache = {};

const appContext = {};

class AppContainer extends RouterMultiple<AppContainerProps, AppContainerState> {
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

  handleHistoryChange = (pageID) => {
    this.loadPage(pageID);
  }

  loadPage = (pageID) => {
    this.setState({
      preparingPage: true
    });
    GetPageAuthConfig(pageID)
      .then((pageAuthConfig) => {
        pageAuthCache[pageID] = pageAuthConfig;
        // 页面权限控制
        if (pageAuthConfig.isPageActive) {
          // 页面缓存控制
          if (pageCache[pageID]) {
            this.selectTab(pageID, {
              preparingPage: false
            });
          } else {
            LoadPage(pageID)
              .then((pageData) => {
                pageCache[pageID] = IUBDSLParser({ dsl: pageData });
                this.setState({
                  preparingPage: false
                });
              })
              .catch((err) => {});
          }
        }
      })
      .catch((err) => {});
  }

  render() {
    const {
      routers, routerInfo, activeRouteIdx, activeRoute,
      navStore, ready
    } = this.state;
    const { children } = this.props;
    return (
      <div id="app-container">
        {children}
        {
          ready ? (
            <React.Fragment>
              <Nav navConfig={navStore} />
              <div
                className="router-tabs"
                style={{
                  margin: 20
                }}
              >
                <div>Tab container</div>
                {
                  routers.map((route, idx) => {
                    return (
                      <span
                        key={route}
                        className="label"
                        style={{
                          padding: 20
                        }}
                      >
                        <Link
                          to={route}
                        >
                          {route}
                        </Link>
                      </span>
                    );
                  })
                }
              </div>
              <div className="pages-container">
                {
                  Object.keys(routerInfo).map((pageID, idx) => {
                    const pageItemInfo = routerInfo[pageID];
                    const currPage = pageCache[pageID];
                    const pageAuthInfo = pageAuthCache[pageID];
                    const isShow = pageID === activeRoute;
                    const pageKey = pageID;
                    return (
                      <div
                        key={pageKey}
                        style={{
                          display: isShow ? 'block' : 'none'
                        }}
                      >
                        <PageContainer
                          type='iub-dsl'
                          pageID={pageID}
                          dsl={currPage}
                          pageAuthInfo={pageAuthInfo}
                          appContext={appContext}
                        >

                        </PageContainer>
                      </div>
                    );
                  })
                }
              </div>
            </React.Fragment>
          ) : (
            <div>Loading</div>
          )
        }
      </div>
    );
  }
}

export default AppContainer;
