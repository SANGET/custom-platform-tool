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

import { TABS_OPERATION, TAB_TYPE, ITabsItem } from '@/models/tabs';
import { getQueryByParams } from '@/utils/utils';
import styles from "./index.less";

const { TabPane } = Tabs;

interface ITabsContainerProps {
  activeKey: string;
  dispatch: Dispatch;
  tabsData: ITabsItem[];
  children: React.ReactNode;
}

const TabsContainer: React.FC<ITabsContainerProps> = (props): React.ReactElement => {
  const {
    activeKey, tabsData, dispatch
  } = props;
  const handleTabChange = (key: string) => {
    if (key === props.activeKey) return;
    dispatch({
      type: "tabs/updata",
      payload: key
    });
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
          <TabPane tab={item.title} key={item.menuId} closable={item.closable}>
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
