import TableStruct from "@provider-app/data-designer/src/pages/TableStruct";
import PageManager from "@provider-app/page-manager/app";
import MenuManager from "@provider-app/menu-manager/app";
import PageDesignerApp from "@provider-app/page-designer/src/app";

const Router = {
  '/menu-manager': MenuManager,
  '/page-manager': PageManager,
  '/TableStruct': TableStruct,
  '/page-designer': PageDesignerApp,
};

export default Router;
