import { GroupPanelData } from "@engine/visual-editor/components/GroupPanel";
import {
  getCompClassDeclareData, getCompPanelData,
  getPagePropsDeclareData, getPropItemDeclareData,
  getPropPanelData,
} from "@mock-data/page-designer/mock-data";
import { getPageDetailService } from "@provider-app/services";
import { getDataSourcePanelConfig } from "../components/DataSource";
import { extraDatasources } from "./datasource-filter";

/**
 * 将数据源转换成组件面板的数据
 * @param dataSource
 */
export const setCompPanelData = (
  compPanelData,
  datasources,
  onUpdatedDatasource
): GroupPanelData => {
  return [...compPanelData, getDataSourcePanelConfig({
    datasources,
    onUpdatedDatasource
  })];
};

/**
 * 准备应用数据
 * @param pageID
 */
export default (pageID: string, onUpdatedDatasource) => {
  return new Promise((resolve, reject) => {
    Promise.all([
      getCompClassDeclareData(),
      getCompPanelData(),
      getPagePropsDeclareData(),
      getPropItemDeclareData(),
      getPropPanelData(),
    ])
      .then(([
        compClassDeclares,
        compPanelData,
        pagePropsData,
        propItemDeclares,
        propPanelData,
      ]) => {
        getPageDetailService(pageID)
          .then((pageDataRes) => {
            const { dataSources } = pageDataRes;
            const { pageContent: pageData } = pageDataRes;
            extraDatasources(dataSources)
              .then((datasources) => {
                const initData = {
                  compPanelData: setCompPanelData(compPanelData, datasources, onUpdatedDatasource),
                  propPanelData,
                  compClassDeclares,
                  propItemDeclares,
                  pagePropsData,
                  /** 回填数据的入口 */
                  pageData,
                  options: {
                    pageDataRes,
                    // 填入 datasources
                    datasources,
                  }
                };
                resolve(initData);
              });
          });

        // SelectEntity(PageEntity);
      })
      .catch((err) => {
        // TODO: 处理异常
        reject(err);
      });
  });
};
