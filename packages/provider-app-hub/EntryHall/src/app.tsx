import React from "react";

import {
  RouterMultiple, Link,
  defaultState as defaultRouteState,
  RouterState, RouterHelperProps
} from 'multiple-page-routing';

import { GetMenu } from './services/menu';
import { PageContainer, Nav } from './components';
import router from './config/router';

import "antd/dist/antd.css";
import { TabNav } from "./components/TabNav";

interface AppContainerState extends RouterState {
  ready?: boolean;
  navStore?: [];
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

  render() {
    const {
      routers, routerInfo, activeRouteIdx, activeRoute,
      navStore, ready
    } = this.state;
    console.log(routerInfo);

    return (
      <div id="app-container">
        {
          ready ? (
            <>
              <Nav navConfig={navStore} />
              <TabNav routers={routers} routerInfo={routerInfo} activeRoute={activeRoute} />
              <div className="pages-container">
                {
                  Object.keys(routerInfo).map((pageID, idx) => {
                    const pageItemInfo = routerInfo[pageID];
                    const pageAuthInfo = pageAuthCache[pageID];
                    const isShow = pageID === activeRoute;
                    const pageKey = pageID;

                    // TODO: 优化加载页面
                    const C = router[activeRoute] || 'div';

                    return (
                      <div
                        key={pageKey}
                        style={{
                          display: isShow ? 'block' : 'none'
                        }}
                      >
                        <PageContainer
                          pageID={pageID}
                          pageAuthInfo={pageAuthInfo}
                        >
                          <C />
                        </PageContainer>
                      </div>
                    );
                  })
                }
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
