import React, { FC } from 'react';
// 全局样式
import './styles/index.less';

import {
  Switch, Route, Link, BrowserRouter
} from 'react-router-dom';

import { Menu } from 'antd';
import Icon from '@ant-design/icons';

/** 导入路由 */
import ROUTES from './routes';

const App: FC = () => {
  // 默认选中和打开的菜单
  const defaultSelectedKeys = ROUTES[0].key;
  const handleClick = (e) => {
    console.log('click ', e);
  };

  return (
    /** 在BrowserRouter定义样式无效 */
    <BrowserRouter>
      <div className="app-container">
        <Menu
          className="menu"
          onClick={handleClick}
          style={{ width: 256, paddingTop: 20 }}
          theme="dark"
          defaultSelectedKeys={[defaultSelectedKeys]}
          defaultOpenKeys={[defaultSelectedKeys]}
          mode="inline"
        >
          {ROUTES.map((route) => (
            <Menu.Item key={route.key}>
              <Link to={route.link}>
                <Icon type={route.iconType} />
                <b>{route.text}</b>
              </Link>
            </Menu.Item>
          ))}
        </Menu>
        <main>
          <Switch>
            <div style={{ background: '#fff', padding: 24, height: '100%' }}>
              {ROUTES.map((route) => (
                <Route exact key={route.key} path={route.link} component={route.component} />
              ))}
            </div>
          </Switch>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
