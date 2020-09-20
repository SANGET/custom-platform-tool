import React, { useEffect, useState } from 'react';

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
        Array.isArray(datasources) && datasources.map((datasourceItem) => {
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
