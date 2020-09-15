import React from 'react';

export const DataSourceAddBtn = ({
  dataSources
}) => {
  console.log(dataSources);
  return (
    <div>
      数据源
      <span
        onClick={(e) => {
          console.log('add');
        }}
      >
        +
      </span>
    </div>
  );
};
