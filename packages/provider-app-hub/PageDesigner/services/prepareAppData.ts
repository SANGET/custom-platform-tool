import {
  getWidgetDefinitionData, getWidgetPanelData,
  getPagePropItems, getPropItemData,
  getPropPanelData,
} from "@mock-data/page-designer/mock-data";
import { getPageDetailService } from "@provider-app/services";
// import { getDataSourcePanelConfig } from "../components/DataSource";
import { extraDatasources } from "./datasource";

/**
 * 获取页面详细数据
 * @param pageID 页面 id
 */
export const getPageContentWithDatasource = async (pageID) => {
  const pageDataRes = await getPageDetailService(pageID);
  const { dataSources, pageContent } = pageDataRes;
  const datasources = await extraDatasources(dataSources);
  return {
    pageDataRes,
    pageContent,
    datasources
  };
};
// const initData = {
//   compClassForPanelData: setCompPanelData(compClassForPanelData, datasources, onUpdatedDatasource),
//   propPanelData,
//   compClassCollection,
//   propItemData,
//   pagePropsData,
//   /** 回填数据的入口 */
//   pageContent,
//   options: {
//     pageDataRes,
//     // 填入 datasources
//     datasources,
//   }
// : setCompPanelData(compClassForPanelData, datasources, onUpdatedDatasource)
/**
 * 获取前端动态资源
 *
 * // TODO: 需要从远端获取组件类的实际组件
 */
export const getFEDynamicData = async () => {
  const [
    compClassCollection,
    compClassForPanelData,
    pagePropsData,
    propItemData,
    propPanelData,
  ] = await Promise.all([
    getWidgetDefinitionData(),
    getWidgetPanelData(),
    getPagePropItems(),
    getPropItemData(),
    getPropPanelData(),
  ]);

  const FEDynamicData = {
    compClassForPanelData,
    propPanelData,
    compClassCollection,
    propItemData,
    pagePropsData,
  };

  return FEDynamicData;
};
