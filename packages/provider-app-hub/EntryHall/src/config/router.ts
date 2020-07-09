import DataManager from "@provider-app/data-manager/app";
import PageManager from "@provider-app/page-manager/app";
import MenuManager from "@provider-app/menu-manager/app";
import AuthManager from "@provider-app/auth-manager/src/app";
import { PageDesignerApp } from "@provider-app/page-designer/src/app";

const Router = {
  '/auth-manager': AuthManager,
  '/menu-manager': MenuManager,
  '/page-manager': PageManager,
  '/data-manager': DataManager,
  '/page-designer': PageDesignerApp,
};

export default Router;
