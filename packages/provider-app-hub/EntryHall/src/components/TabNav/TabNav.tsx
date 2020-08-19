import React from 'react';
import { Tabs } from 'antd';
import {
  Link, onNavigate
} from 'multiple-page-routing';

const { TabPane } = Tabs;

export const TabNav = ({ routers, routerInfo, activeRoute }) => {
  const onChange = (activeKey) => {
    onNavigate({
      type: 'PUSH',
      route: activeKey,
      params: routerInfo[activeKey].params
    });
  };
  return (
    <Tabs
      hideAdd
      type="editable-card"
      onChange={onChange}
      activeKey={activeRoute}
    >
      {
        routers.map((route) => {
          const { params: routeInfoParams } = routerInfo[route];
          const { title, key, closable } = routeInfoParams;
          const _title = title || `${route}_未设置 title`;
          return (
            <TabPane tab={_title} key={route} closable={closable} />
          );
        })
      }
    </Tabs>
  );
};
