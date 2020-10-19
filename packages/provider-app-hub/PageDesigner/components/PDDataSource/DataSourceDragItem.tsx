import React, { useEffect, useState } from 'react';

interface DataSourceDragItemProps {
  /** 内部的数据源格式 */
  interDatasources: PD.Datasources
}

/**
 * 根据 columns 包装可以拖拽的元素
 */
export const DataSourceDragItem: React.FC<DataSourceDragItemProps> = ({
  interDatasources
}) => {
  return (
    <div className="data-source-drag-items">
      {
        Array.isArray(interDatasources) && interDatasources.map((datasourceItem) => {
          const { name: dName, columns } = datasourceItem;
          return (
            <div className="group p-2" key={dName}>
              <div className="title font-bold text-md">{dName}</div>
              <div className="list p-2">
                {
                  columns.map((column) => {
                    const { name: colName, id } = column;
                    return (
                      <div className="col-item text-gray-600" key={id}>
                        {colName}
                      </div>
                    );
                  })
                }
              </div>
            </div>
          );
        })
      }
    </div>
  );
};
