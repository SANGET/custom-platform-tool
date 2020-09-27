import React from 'react';
import {
  Tabs, Menu, Dropdown
} from 'antd';
import { ConnectState } from '@/models/connect';
import {
  connect, Dispatch, history
} from 'umi';

import { EDIT_STATUS, ROUTER_SUFFIX } from '@/constant';
import {
  EllipsisOutlined
} from '@ant-design/icons';

import { TABS_OPERATION, TAB_TYPE } from '@/models/tabs';
import { getQueryByParams } from '@/utils/utils';
import styles from "./index.less";

const { TabPane } = Tabs;

interface ITabsContainerProps {
  activeKey: string;
  dispatch: Dispatch;
  tabsData: any[];
  children: React.ReactNode;
}

const TabsContainer: React.FC<ITabsContainerProps> = (props): React.ReactElement => {
  const {
    activeKey, tabsData, dispatch
  } = props;
  const queryLink = getQueryByParams(["mode", "app", "lessee"]);
  const handleTabChange = (key: string) => {
    if (key === props.activeKey) return;
    const tab = tabsData.find((item) => item.path === key);
    const link = tab.page === TAB_TYPE.PAGE ? `${ROUTER_SUFFIX}?path=${key}&${queryLink}` : `${key}?${queryLink}`;
    dispatch({
      type: "tabs/updata",
      payload: key
    });
    history.push(link);
  };
  const handleEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    if (action === EDIT_STATUS.REMOVE) {
      dispatch({
        type: "tabs/remove",
        payload: targetKey
      });
    }
  };
  const handleMenuClick = (info) => {
    const { key } = info;
    dispatch({
      type: "tabs/close",
      payload: +key
    });
  };
  const renderOperations = (): React.ReactElement => {
    const menu = (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key={TABS_OPERATION.CLOSE_PREVIOUS_PAGE}>关闭当前标签页</Menu.Item>
        <Menu.Item key={TABS_OPERATION.CLOSE_OTHER_PAGE}>关闭其他标签页</Menu.Item>
        <Menu.Item key={TABS_OPERATION.CLOSE_ALL_PAGE}>关闭全部标签页</Menu.Item>
      </Menu >
    );
    return (
      <Dropdown overlay={menu} >
        <EllipsisOutlined className={styles["ant-dropdown-link"]} />
      </Dropdown>
    );
  };
  return (
    <Tabs
      hideAdd
      type="editable-card"
      onChange={handleTabChange}
      activeKey={activeKey}
      animated={false}
      onEdit={handleEdit}
      tabBarExtraContent={renderOperations()}
    >
      {
        tabsData?.map((item) => (
          <TabPane tab={item.title} key={item.path} closable={item.closable}>
          </TabPane>
        ))
      }
    </Tabs>
  );
};

export default connect(({ tabs }: ConnectState) => ({
  tabsData: tabs.list || [],
  activeKey: tabs.activeKey,
}))(TabsContainer);
