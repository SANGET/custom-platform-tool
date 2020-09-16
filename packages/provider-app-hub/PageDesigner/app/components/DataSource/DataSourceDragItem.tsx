import React, { useEffect, useState } from 'react';
import { getDataSourceDetailFromRemote } from '../../utils/datasource-filter';

/**
 * 自定义 react hook，用于管理 datasource 数据
 * @param dataSources
 */
const useDataSourceData = (dataSources) => {
  const [dataSourceData, setDataSourceData] = useState<PD.Datasources>([]);
  useEffect(() => {
    getDataSourceDetailFromRemote(dataSources).then((res) => {
      setDataSourceData(dataSources);
    });
  }, []);
  return [dataSourceData];
};

interface DataSourceDragItemProps {
  datasources: PD.Datasources
}

/**
 * 根据 columns 包装可以拖拽的元素
 */
export const DataSourceDragItem: React.FC<DataSourceDragItemProps> = ({
  datasources
}) => {
  return (
    <div className="data-source-drag-items">
      {
        datasources.map((datasourceItem) => {
          const { name: dName, columns } = datasourceItem;
          return (
            <div className="group" key={dName}>
              <div className="title">{dName}</div>
              <ul>
                {
                  columns.map((column) => {
                    const { name: colName, id, dataType } = column;
                    return (
                      <li className="col-item" key={id}>
                        {colName}
                      </li>
                    );
                  })
                }
              </ul>
            </div>
          );
        })
      }
    </div>
  );
};
