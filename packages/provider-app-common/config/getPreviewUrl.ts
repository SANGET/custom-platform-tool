import { getAppConfig } from "./config-manager";

export const getPreviewUrl = (appLocation?, appName = '测试应用') => {
  const perviewAppUrl = getAppConfig('perviewAppUrl');
  if (!appLocation) return `${perviewAppUrl}`;
  const { pageID, lessee = 'hy', app } = appLocation;
  return `${perviewAppUrl}/#/page?menuid=/preview&mode=preview&pageId=${pageID}&lessee=${lessee}&app=${app}&appName=${appName}`;
};
