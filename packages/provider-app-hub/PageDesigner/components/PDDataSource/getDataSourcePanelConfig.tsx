import React from 'react';
import { DataSourceDragItem } from './DataSourceDragItem';
import { DataSourceSelector } from './DataSourceSelector';

interface WrapAddDataSourceBtnOptions {
  interDatasources
  onUpdatedDatasource
}
/**
 * 获取组件类面板的「数据源」标签的配置
 */
export const getDataSourcePanelConfig = (options: WrapAddDataSourceBtnOptions) => {
  const { interDatasources, onUpdatedDatasource } = options;
  return {
    // 通过嵌入 react component 到组件类面板的 title 属性中
    title: (
      <DataSourceSelector
        interDatasources={interDatasources}
        onAddDataSource={(addData) => {
          // return console.log(addData);
          onUpdatedDatasource(addData);
        }}
      />
    ),
    renderer: (groupConfig, idx) => {
      return (
        <DataSourceDragItem interDatasources={interDatasources} />
      );
    }
  };
};
