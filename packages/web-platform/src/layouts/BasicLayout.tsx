import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings
} from '@ant-design/pro-layout';
import * as IconMap from "react-icons/all";
import React from 'react';
import {
  Link, connect, Dispatch, history
} from 'umi';
import {
  Spin, Layout, Menu
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
import Icon, { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import styles from './styles.less';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export interface IBasicLayoutProps extends ProLayoutProps {
  settings: Settings;
  dispatch: Dispatch;

  loadingMenu?: boolean;

  menuData: MenuDataItem[];
  originalMeunData?: MenuDataItem[];
  tabsData?: ITabsItem[];
  activeKey?: string;
}
interface IBaseLayoutState {
  openKeys: string[];
  collapsed: boolean;
}

class BasicLayout extends React.PureComponent<IBasicLayoutProps, IBaseLayoutState> {
  state: IBaseLayoutState = {
    openKeys: [],
    collapsed: false,
  }

  async componentDidMount() {
    this.setPreviewMenuAndTabs();
    const res = await this.getMenu();
    this.setDefaultTabs(res.result || []);
    this.setDefaultOpenKeys();
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
  setPreviewMenuAndTabs() {
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
  setDefaultOpenKeys() {
    const menuId = this.getHistoryQueryValue("menuId");
    if (!menuId) return;
    const selectKeys = [];
    this.getMenuPidByPath(menuId, selectKeys);
    const openKeys = selectKeys.reverse();
    this.setState({
      openKeys
    });
  }

  getMenuPidByPath(menuId, pids) {
    const { originalMeunData } = this.props;
    const find = originalMeunData?.find((item) => item.id === menuId);
    if (find) {
      find.pid && pids.push(find.pid);
      this.getMenuPidByPath(find.pid, pids);
    }
  }

  getQueryByParams = (params: string[]) => {
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

  getHistoryQueryValue = (key: string): string => {
    const { query } = history.location;
    return query[key] || "";
  }

  setDefaultTabs = (menu) => {
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

  getMenu = async () => {
    const { dispatch } = this.props;
    return dispatch({
      type: "menus/getMenu",
      payload: {
        menuName: ""
      }
    });
  }

  handleMenuCollapse = (payload: boolean): void => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload,
    });
  }

  renderMenuContent = (props: SiderMenuProps, dom: React.ReactNode): React.ReactNode => {
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
  handleMenuSelect = (info): void => {
    const {
      page, id, pageId, name, path
    } = info;
    const { dispatch, activeKey } = this.props;
    const { query } = history.location;
    const { mode, app, lessee } = query;
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

  handleCollapseChange = (collapsed: boolean) => {
    const { dispatch } = this.props;
    dispatch({
      type: "global/changeLayoutCollapsed",
      payload: collapsed
    });
  }

  handleSettingChange = (config) => {
    console.dir(config);
  }

  handleOpenChange = (openKeys) => {
    this.setState({
      openKeys
    });
  }

  IconAppointed = (props) => {
    const { iconType } = props;
    if (typeof iconType === "string") {
      const RIcon = IconMap[iconType];
      return (
        RIcon ? <Icon component={() => <RIcon className={styles.menuIcon}/>} /> : null
      );
    }
    return iconType;
  };

  loopMenuItemRender = (menus: MenuDataItem[]): React.ReactNode => menus.map((menuItemProps) => {
    const {
      id, key, path, name, icon, children
    } = menuItemProps;
    const MenuIcon = icon ? this.IconAppointed({ iconType: icon }) : null;
    if (Array.isArray(children)) {
      return <SubMenu key={key || id || path} icon={MenuIcon} title={name}>
        {this.loopMenuItemRender(children)}
      </SubMenu>;
    }
    return <Menu.Item key={key || id || path} icon={MenuIcon} onClick={() => this.handleMenuSelect(menuItemProps)}>{name}</Menu.Item>;
  });

  mergeMenu=(menuData) => {
    const { route } = this.props;
    if (route && Array.isArray(route.routes)) {
      return [...route?.routes.filter((child) => child.name), ...menuData];
    }
    return menuData;
  }

  loopMenuItem = (menus: MenuDataItem[]): MenuDataItem[] => menus.map(({ icon, children, ...item }) => {
    return {
      ...item,
      key: item.id,
      icon: typeof icon === "string" ? this.IconAppointed({ iconType: icon }) : icon,
      children: children && this.loopMenuItem(children),
    };
  });

  onCollapse = (collapsed: boolean) => {
    this.setState({ collapsed });
  };

  render() {
    const {
      settings, menuData, activeKey
    } = this.props;
    const { openKeys, collapsed } = this.state;
    return (
      <Layout style={{ minHeight: "100%" }}>
        <Header className="header">
          <div className={styles.logo} >{settings.title || ""}</div>
        </Header>
        <Layout>
          <Sider width={200} className="site-layout-background" collapsed={collapsed} onCollapse={this.onCollapse} collapsible >
            <Menu
              mode="inline"
              selectedKeys={activeKey ? [activeKey] : []}
              openKeys={openKeys || []}
              onOpenChange={this.handleOpenChange}
              style={{ height: '100%', borderRight: 0 }}
            >
              {this.loopMenuItemRender(this.mergeMenu(menuData))}
            </Menu>
          </Sider>
          <Layout>
            <Content
              className="site-layout-background"
              style={{ margin: 0 }}
            >
              <TabsContainer children={this.props.children} />
              <div className={styles.container} >
                {this.props.children}
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
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
