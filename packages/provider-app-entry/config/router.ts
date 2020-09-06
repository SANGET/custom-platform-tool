import TableStruct from "@provider-app/data-designer/src/pages/TableStruct";
import PageManager from "@provider-app/page-manager/app";
import MenuManager from "@provider-app/menu-manager/app";
import PageDesignerApp from "@provider-app/page-designer/app/main";

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
    component: TableStruct,
    title: '数据表结构'
  },
  '/page-designer': {
    component: PageDesignerApp,
    title: '页面设计'
  },
};

export const getRouteName = (route) => {
  const routeName = RouterConfig[route].title;
  if (!routeName) console.error(`请注意，没找到注册的路由信息 ${route}`);
  return routeName;
};

export default RouterConfig;
