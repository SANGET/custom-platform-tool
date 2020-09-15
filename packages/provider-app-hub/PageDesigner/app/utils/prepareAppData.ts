import {
  getCompClassDeclareData, getCompPanelData,
  getPagePropsDeclareData, getPropItemDeclareData,
  getPropPanelData,
} from "@mock-data/page-designer/mock-data";
import React from "react";
import { getPageDetailService } from "../../services/apis";
import { DataSourceAddBtn } from "./DataSourceAddBtn";

/**
 * 将数据源转换成组件面板的数据
 * @param dataSource
 */
const wrapDataSourceItem2CompItem = (compPanelData, dataSources) => {
  return [...compPanelData, {
    title: React.createElement(DataSourceAddBtn, {
      dataSources
    })
  }];
};

/**
 * 准备应用数据
 * @param pageID
 */
export default (pageID: string) => {
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
            console.log(pageDataRes);
            const pageData = pageDataRes.pageContent;
            const initData = {
              // compPanelData,
              compPanelData: wrapDataSourceItem2CompItem(compPanelData, pageDataRes.dataSources),
              propPanelData,
              compClassDeclares,
              propItemDeclares,
              pagePropsData,
              /** 回填数据的入口 */
              pageData,
              options: {
                pageDataRes
              }
            };
            resolve(initData);
          });

        // SelectEntity(PageEntity);
      })
      .catch((err) => {
        // TODO: 处理异常
        reject(err);
      });
  });
};
