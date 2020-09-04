import TableStruct from "@provider-app/data-designer/src/pages/TableStruct";
import PageManager from "@provider-app/page-manager/app";
import MenuManager from "@provider-app/menu-manager/app";
import PageDesignerApp from "@provider-app/page-designer/app/main";

// interface RouterConfigType {
//   [routeName: string]: {
//     component: HY.SubApp,
//     title: string
//   }
// }

interface RouterType {
  [routeName: string]: HY.SubApp | HY.SubAppHOC
}

const Router: RouterType = {
  '/menu-manager': MenuManager,
  '/page-manager': PageManager,
  '/TableStruct': TableStruct,
  '/page-designer': PageDesignerApp,
};

// const RouterConfig: RouterConfigType = {
//   '/menu-manager': {
//     component: MenuManager,
//     title: '菜单管理'
//   },
//   '/page-manager': {
//     component: PageManager,
//     title: '页面管理'
//   },
//   '/TableStruct': {
//     component: TableStruct,
//     title: '数据表结构'
//   },
//   '/page-designer': {
//     component: PageDesignerApp,
//     title: '页面设计'
//   },
// };

export default Router;
