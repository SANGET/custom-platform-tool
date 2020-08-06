import React, { FC } from 'react';
import { useMappedState } from 'redux-react-hook';

// 全局样式
import '@data-design/styles/index.less';

/** react-router工具暴露方法 */
import {
  Switch, Route, Link, BrowserRouter
} from 'react-router-dom';

import { Menu, Spin } from 'antd';
/** 路由配置 */
import ROUTES from '@data-design/routes';
import IconComp from '@data-design/routes/IconComp';

// console.log();

/** 全局加载动画控制变量 */
const mapState = (state) => ({
  isShowLoading: state.isShowLoading
});

const App: FC = () => {
  // 默认选中和打开的菜单
  const defaultSelectedKeys = ROUTES[0].key;
  const { isShowLoading } = useMappedState(mapState);
  /** 点击菜单绑定事件 */
  const handleClick = (e) => {
    console.log('click ', e);
  };

  return (

    < BrowserRouter >
      <div className={isShowLoading ? 'loading' : 'hide'}>
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
            <>
              <div style={{ background: '#fff', padding: 24, height: '100%' }}>
                {ROUTES.map((route) => (
                  <Route exact key={route.key} path={route.link} component={route.component} />
                ))}
              </div>
            </>
          </Switch>
        </main>
      </div>
    </BrowserRouter >

  );
};

export default App;
