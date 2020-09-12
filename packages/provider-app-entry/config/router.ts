import PageManager from "@provider-app/page-manager/app";
import MenuManager from "@provider-app/menu-manager/app";
import PageDesignerApp from "@provider-app/page-designer/app/main";
/// //////// 数据设计
import {
  TableStruct, DictManage, EditStruct
} from "@provider-app/data-designer/src/pages";

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

interface RouterConfigType {
  [routeName: string]: {
    component: HY.SubApp | HY.SubAppHOC
    title: string
  }
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
  '/data_designer/edit_struct': {
    title: '编辑表',
    component: EditStruct
  },
};

/**
 * 提取 route 的真实 path
 * @param path
 */
export const resolvePath = (path) => {
  return path.split('?')[0];
};

/**
 * 获取路由的名字
 * @param route
 */
export const getRouteName = (path) => {
  const routeName = RouterConfig[resolvePath(path)]?.title;
  if (!routeName) console.error(`请注意，没找到注册的路由信息 ${path}`);
  return routeName;
};

export default RouterConfig;
