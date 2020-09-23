import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import React from 'react';
import {
  Link, connect, Dispatch, history
} from 'umi';
import {
  Spin
} from 'antd';
import RightContent from '@/components/RightContent';
import { ConnectState } from '@/models/connect';
import { SiderMenuProps } from '@ant-design/pro-layout/lib/SiderMenu/SiderMenu';
import MenuExtra from '@/components/MenuExtra';
import TabsContainer from '@/components/TabsContainer';
import { parsePathToOpenKeys } from '@/utils/utils';

export interface IBasicLayoutProps extends ProLayoutProps {
  settings: Settings;
  dispatch: Dispatch;

  loadingMenu?: boolean;

  menuData?: MenuDataItem[];
  tabsData?: MenuDataItem[];
  activeKey?: string;
}
interface IBaseLayoutState {
  openKeys: string[];
}

class BasicLayout extends React.PureComponent<IBasicLayoutProps, IBaseLayoutState> {
  public state: IBaseLayoutState = {
    openKeys: []
  }

  public async componentDidMount() {
    const res = await this.getMenu();
    if (res.code === 0) {
      this.setDefaultTabs(res.result || []);
      this.setInintopenKeys();
    }
  }

  /**
   * 根据url query path 参数设置 初始 展开的 SubMenu 菜单项 key 数组
   *
   */
  public setInintopenKeys() {
    const path = this.getHistoryQueryPath();
    if (path) {
      const openKeys: string[] = parsePathToOpenKeys(path);
      this.setState({
        openKeys
      });
    }
  }

  public getHistoryQueryPath = (): string => {
    const { query } = history.location;
    const { path } = query;
    return path || "";
  }

  public setDefaultTabs = (menu) => {
    const path = this.getHistoryQueryPath();
    if (path) {
      const currentPath = path.split("/").pop();
      const findMenu = menu.find((item) => item.id === currentPath);
      if (findMenu) {
        const { dispatch } = this.props;
        const { name } = findMenu;
        dispatch({
          type: "tabs/add",
          payload: {
            title: name,
            path
          }
        });
      }
    }
  }

  public getMenu = async () => {
    const { dispatch } = this.props;
    return dispatch({
      type: "menus/getMenu",
      payload: {
        menuName: ""
      }
    });
  }

  public handleMenuCollapse = (payload: boolean): void => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload,
    });
  }

  public handlePageChange = (location: any) => {

  }

  public renderMenuContent = (props: SiderMenuProps, dom: React.ReactNode): React.ReactNode => {
    const { loadingMenu } = this.props;
    return loadingMenu ? (<div
      style={{
        padding: '24px 0',
      }}
    >
      <Spin tip="菜单加载中">{dom}</Spin>
    </div>) : (dom);
  }

  public handleMenuClick = () => {

  }

  /**
   * 点击菜单
   * @param param0
   */
  public handleMenuSelect = (info): void => {
    const { item, key } = info;
    console.dir(info);
    const { dispatch, activeKey } = this.props;
    if (key === activeKey) return;
    const { innerText } = item.node;
    dispatch({
      type: "tabs/add",
      payload: {
        path: key,
        title: innerText
      }
    });
  }

  public handleCollapseChange = (collapsed: boolean) => {
    const { dispatch } = this.props;
    dispatch({
      type: "global/changeLayoutCollapsed",
      payload: collapsed
    });
  }

  public handleSettingChange = (config) => {
    console.dir(config);
  }

  public handleOpenChange = (openKeys) => {
    console.dir(openKeys);
    this.setState({
      openKeys
    });
  }

  render() {
    const {
      menuData, settings, activeKey
    } = this.props;
    const { openKeys } = this.state;
    console.dir("=====render ProLayout =========");

    return (
      <ProLayout
        menuHeaderRender={false}
        disableContentMargin={true}
        onCollapse={this.handleMenuCollapse}
        onMenuHeaderClick={() => history.push('/')}
        menuExtraRender={({ collapsed }) => <MenuExtra
          collapsed={collapsed || false}
          onCollapseChange={this.handleCollapseChange}
        />}
        selectedKeys={[activeKey || ""]}
        openKeys={openKeys}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || !menuItemProps.path) {
            return defaultDom;
          }
          const { page, path } = menuItemProps;
          return <Link to={page ? `${page}?path=${path}` : path}>{defaultDom}</Link>;
        }}
        collapsedButtonRender={false}
        siderWidth={300}
        menuDataRender={(menus) => [...menus, ...menuData]}
        menuContentRender={this.renderMenuContent}
        rightContentRender={() => <RightContent />}
        {...this.props}
        {...settings}
        onPageChange={this.handlePageChange}
        menuProps={{
          onSelect: this.handleMenuSelect,
          onOpenChange: this.handleOpenChange,
        }}
      >
        <TabsContainer children={this.props.children} />
      </ProLayout >

    );
  }
}
export default connect(({
  global, settings, menus, loading, tabs
}: ConnectState) => ({
  collapsed: global.collapsed,
  menuData: menus.list || [],
  tabsData: tabs.list || [],
  activeKey: tabs.activeKey,
  settings,
  loadingMenu: loading.effects['menus/getMenu'],
}))(BasicLayout);
