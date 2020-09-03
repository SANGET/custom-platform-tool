import TableStruct from "@provider-app/data-designer/src/pages/TableStruct";
import PageManager from "@provider-app/page-manager/app";
import MenuManager from "@provider-app/menu-manager/app";
import PageDesignerApp from "@provider-app/page-designer/app/main";
import DictManage from '@provider-app/data-designer/src/pages/DictManage';
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

export default Router;
