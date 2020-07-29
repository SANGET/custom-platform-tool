import React, { FC, Fragment, useReducer } from 'react';
// 全局样式
import './styles/index.less';

import {
  Switch, Route, Link, BrowserRouter
} from 'react-router-dom';

import { Menu, Spin } from 'antd';

/** 导入路由 */
import ROUTES from './routes/routes';
import IconComp from './routes/IconComp';
import { loadingReducer, defaultState } from './reducers/auth';

export const AppContext = React.createContext({});

const App: FC = () => {
  // 默认选中和打开的菜单
  const defaultSelectedKeys = ROUTES[0].key;
  const handleClick = (e) => {
    console.log('click ', e);
  };

  const [state, dispatch] = useReducer(loadingReducer, defaultState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {/** 在BrowserRouter定义样式无效 */}
      <BrowserRouter>
        <div className={state.isShowLoading ? 'loading' : 'hide'}>
          <Spin tip="加载中..." size="large" />
        </div>
        <div className="app-container">
          <Menu
            theme="dark"
            mode="inline"
            className="menu"
            onClick={handleClick}
            style={{ width: 256, paddingTop: 20 }}
            defaultSelectedKeys={[defaultSelectedKeys]}
            defaultOpenKeys={[defaultSelectedKeys]}
          >
            {ROUTES.map((route) => (
              <Menu.Item key={route.key}>
                <Link to={route.link}>
                  {/* 动态渲染图标 */}
                  <IconComp type={route.icon} className="icon" />
                  <b>{route.text}</b>
                </Link>
              </Menu.Item>
            ))}
          </Menu>
          <main>
            <Switch>
              {/* Switch里面不能直接嵌套div,因为渲染出来的不是HTML节点,需要用Fragment包裹一下 */}
              <Fragment>
                <div style={{ background: '#fff', padding: 24, height: '100%' }}>
                  {ROUTES.map((route) => (
                    <Route exact key={route.key} path={route.link} component={route.component} />
                  ))}
                </div>
              </Fragment>
            </Switch>
          </main>
        </div>
      </BrowserRouter>
    </AppContext.Provider>
  );
};

export default App;
