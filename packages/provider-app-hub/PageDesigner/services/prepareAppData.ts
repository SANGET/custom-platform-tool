import {
  getCompClassDeclareData, getCompClassForPanelData,
  getPagePropsDeclareData, getPropItemDeclareData,
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
 */
export const getFEDynamicData = async () => {
  const [
    compClassCollection,
    compClassForPanelData,
    pagePropsData,
    propItemData,
    propPanelData,
  ] = await Promise.all([
    getCompClassDeclareData(),
    getCompClassForPanelData(),
    getPagePropsDeclareData(),
    getPropItemDeclareData(),
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
