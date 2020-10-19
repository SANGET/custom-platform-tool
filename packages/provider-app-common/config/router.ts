import PageManager from "@provider-app/page-manager/app";
import MenuManager from "@provider-app/menu-manager/app";
import PageDesignerApp from "@provider-app/page-designer/main";
/// //////// 数据设计
import TableInfo from "@provider-app/table-info/app";
import TableEditor from "@provider-app/table-editor/app";
import DictionaryManager from "@provider-app/dictionary-manager/app";
import TableStructure from "@provider-app/table-structure/app";

import PopupWindowSelector from "@provider-app/popup-window-selector/app";

/// //////// 数据设计结束
import { resolvePagePath } from "multiple-page-routing/utils";

// interface RouterType {
//   [routeName: string]: HY.SubApp | HY.SubAppHOC
// }

// const Router: RouterType = {
//   '/menu-manager': MenuManager,
//   '/page-manager': PageManager,
//   '/TableStruct': TableStruct,
//   '/page-designer': PageDesignerApp,
// };

// export default Router;

export interface RouteItemType {
  component: HY.SubApp | HY.SubAppHOC
  title: string
  /** 是否用于重定向的路由配置 */
  type?: 'redirect'
}

export interface RouterConfigType {
  [routeName: string]: RouteItemType
}

const RouterConfig: RouterConfigType = {
  '/menu-manager': {
    component: MenuManager,
    title: '菜单管理'
  },
  '/page-manager': {
    component: PageManager,
    title: '页面管理'
  },
  '/TableStruct': {
    component: TableStructure,
    title: '数据表结构'
  },
  '/page-designer': {
    component: PageDesignerApp,
    title: '页面设计'
  },
  '/dictionary-manager': {
    component: DictionaryManager,
    title: '字典管理'
  },
  '/table-info': {
    title: '编辑表',
    component: TableInfo
  },
  '/popup-window-selector': {
    title: '弹窗选择',
    component: PopupWindowSelector
  },
  '/table-editor': {
    title: '编辑表',
    component: TableEditor
  },
};

/**
 * 获取路由的名字
 * @param route
 */
export const getRouteName = (path) => {
  const routeName = RouterConfig[resolvePagePath(path)]?.title;
  if (!routeName) console.warn(`请注意，没找到注册的路由信息 ${path}`);
  return routeName;
};

export default RouterConfig;
