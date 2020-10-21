import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings
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
import { getQueryByParams } from '@/utils/utils';
import { ITabsItem } from "@/models/tabs";
import { IMenuItem } from "@/models/menu";
import { MODE_PREVIEW } from '@/constant';
import styles from './styles.less';

export interface IBasicLayoutProps extends ProLayoutProps {
  settings: Settings;
  dispatch: Dispatch;

  loadingMenu?: boolean;

  menuData: IMenuItem[];
  originalMeunData?: IMenuItem[];
  tabsData?: ITabsItem[];
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
    this.setPreviewMenuAndTabs();
    const res = await this.getMenu();
    if (res?.code === "SA0000") {
      this.setDefaultTabs(res.result || []);
      this.setDefaultopenKeys();
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menus/destory',
    });
    dispatch({
      type: 'tabs/destory',
    });
  }

  /**
   * 预览模式添加菜单和tabs
   */
  public setPreviewMenuAndTabs() {
    const mode = this.getHistoryQueryValue("mode");
    const { query } = history.location;
    const { pageId } = query;
    if (mode === MODE_PREVIEW) {
      const { dispatch } = this.props;
      dispatch({
        type: "menus/addPreViewMenu",
        payload: {
          id: "preview",
          page: "/page",
          path: "preview",
          name: "预览",
          menuId: "preview",
          pageId
        }
      });
      dispatch({
        type: "tabs/add",
        payload: {
          path: "/page",
          title: "预览",
          closable: true,
          menuId: "preview",
          pageId
        }
      });
    }
  }

  /**
   * 根据url query path 参数设置 初始 展开的 SubMenu 菜单项 key 数组
   *
   */
  public setDefaultopenKeys() {
    const menuId = this.getHistoryQueryValue("menuId");
    if (!menuId) return;
    const selectKeys = [];
    this.getMenuPidsByPath(menuId, selectKeys);
    const openKeys = selectKeys.reverse();
    this.setState({
      openKeys
    });
  }

  public getMenuPidsByPath(menuId, pids) {
    const { originalMeunData } = this.props;
    const find = originalMeunData?.find((item) => item.id === menuId);
    if (find) {
      find.pid && pids.push(find.pid);
      this.getMenuPidsByPath(find.pid, pids);
    }
  }

  public getQueryByParams = (params: string[]) => {
    const { query } = history.location;
    let result = "";
    params.map((item) => {
      if (query[item]) {
        result === "" ? result += `${item}=${query[item]}` : result += `&${item}=${query[item]}`;
      }
      return item;
    });
    return result;
  }

  public getHistoryQueryValue = (key: string): string => {
    const { query } = history.location;
    return query[key] || "";
  }

  public setDefaultTabs = (menu) => {
    const { query } = history.location;
    const {
      menuId, app, mode, lessee, pageId
    } = query;
    if (menuId) {
      const findMenu = menu.find((item) => item.id === menuId);
      if (findMenu) {
        const { dispatch } = this.props;
        const { name } = findMenu;
        dispatch({
          type: "tabs/add",
          payload: {
            title: name,
            menuId,
            path: "/page",
            app,
            mode,
            lessee,
            pageId
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

  /**
   * 点击菜单
   * @param param0
   */
  public handleMenuSelect = (info): void => {
    const {
      page, id, pageId, name, path
    } = info;
    const { dispatch, activeKey } = this.props;
    const { query } = history.location;
    const { mode, app, lessee } = query;
    console.dir(info);
    const queryLink = getQueryByParams(["mode", "app", "lessee"]);
    const link = page ? `${page}?menuId=${id}&${queryLink}&pageId=${pageId}` : `${path}?${queryLink}`;
    if (id !== activeKey) {
      dispatch({
        type: "tabs/add",
        payload: {
          path: page || path,
          title: name,
          pageId,
          menuId: id || path,
          mode,
          app,
          lessee
        }
      });
    }
    history.push(link);
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
    this.setState({
      openKeys
    });
  }

  render() {
    const {
      menuData, settings, activeKey
    } = this.props;
    const { openKeys } = this.state;
    return (
      <ProLayout
        menuHeaderRender={false}
        disableContentMargin={true}
        onCollapse={this.handleMenuCollapse}
        onMenuHeaderClick={() => history.push('/')}
        // menuExtraRender={({ collapsed }) => <MenuExtra
        //   collapsed={collapsed || false}
        //   onCollapseChange={this.handleCollapseChange}
        // />}
        selectedKeys={[activeKey || ""]}
        openKeys={openKeys}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || !menuItemProps.path) {
            return defaultDom;
          }
          const {
            id, path
          } = menuItemProps;
          return <div key={id || path} onClick={() => this.handleMenuSelect(menuItemProps)}>{defaultDom}</div>;
        }}
        // collapsedButtonRender={false}
        // siderWidth={300}
        postMenuData={(menus) => [...menus, ...menuData]}
        menuContentRender={this.renderMenuContent}
        rightContentRender={() => <RightContent />}
        {...this.props}
        {...settings}
        // onPageChange={this.handlePageChange}
        menuProps={{
          onOpenChange: this.handleOpenChange,
        }}
      >
        <TabsContainer children={this.props.children} />
        <div className={styles.container} >
          {this.props.children}
        </div>
      </ProLayout >

    );
  }
}

export default connect(({
  global, settings, menus, loading, tabs
}: ConnectState) => {
  return {
    collapsed: global.collapsed,
    menuData: menus.list,
    originalMeunData: menus.original || [],
    tabsData: tabs.list || [],
    activeKey: tabs.activeKey,
    settings,
    loadingMenu: loading.effects['menus/getMenu'],
  };
})(BasicLayout);
