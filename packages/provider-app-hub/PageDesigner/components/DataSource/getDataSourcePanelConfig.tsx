import React from 'react';
import { DataSourceDragItem } from './DataSourceDragItem';
import { DataSourceSelector } from './DataSourceSelector';

interface WrapAddDataSourceBtnOptions {
  datasources
  onUpdatedDatasource
}
/**
 * 获取组件类面板的「数据源」标签的配置
 */
export const getDataSourcePanelConfig = (options: WrapAddDataSourceBtnOptions) => {
  const { datasources, onUpdatedDatasource } = options;
  return {
    // 通过嵌入 react component 到组件类面板的 title 属性中
    title: (
      <DataSourceSelector
        datasources={datasources}
        onAddDataSource={(addData) => {
          // return console.log(addData);
          onUpdatedDatasource(addData);
        }}
      />
    ),
    renderer: (groupConfig, idx) => {
      return (
        <DataSourceDragItem datasources={datasources} />
      );
    }
  };
};
