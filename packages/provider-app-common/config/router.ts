import PageManager from "@provider-app/page-manager/app";
import MenuManager from "@provider-app/menu-manager/app";
import PageDesignerApp from "@provider-app/page-designer/main";
/// //////// 数据设计
import {
  TableStruct, DictManage, EditStruct
} from "@provider-app/data-designer/src/pages";
import TableInfo from "@provider-app/table-info/app";
import TableStructure from "@provider-app/table-structure/app";
/// //////// 数据设计结束

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
}

export interface RedirectRouteType {
  redirect: string
}

export interface RouterConfigType {
  [routeName: string]: RouteItemType | RedirectRouteType
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
  '/DictManage': {
    component: DictManage,
    title: '字典管理'
  },
  '/table-info': {
    title: '编辑表',
    component: TableInfo
  },
};

/**
 * 提取 route 的真实 path
 * @param path
 */
export const resolvePath = (path) => {
  return path.split('?')[0].replace('#', '');
};

/**
 * 获取路由的名字
 * @param route
 */
export const getRouteName = (path) => {
  const routeName = RouterConfig[resolvePath(path)]?.title;
  if (!routeName) console.warn(`请注意，没找到注册的路由信息 ${path}`);
  return routeName;
};

export default RouterConfig;
