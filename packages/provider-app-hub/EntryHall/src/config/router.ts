import TableStruct from "@provider-app/data-designer/src/pages/TableStruct";
import PageManager from "@provider-app/page-manager/app";
import MenuManager from "@provider-app/menu-manager/app";
import PageDesignerApp from "@provider-app/page-designer/app/main";
//<<<<<<< HEAD
import DictManage from '@provider-app/data-designer/src/pages/DictManage';
//=======

// interface RouterConfigType {
//   [routeName: string]: {
//     component: HY.SubApp,
//     title: string
//   }
// }

//>>>>>>> ec15ca8819e19df7ff66fedb46d5cbe56d061518
interface RouterType {
  [routeName: string]: HY.SubApp
}

const Router: RouterType = {
  '/menu-manager': MenuManager,
  '/page-manager': PageManager,
  '/TableStruct': TableStruct,
  '/page-designer': PageDesignerApp,
  '/DictManage':DictManage
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
