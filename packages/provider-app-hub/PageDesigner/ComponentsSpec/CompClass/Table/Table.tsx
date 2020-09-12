import React from 'react';
import { Table as AntTable } from 'antd';

// import { columns, data } from './mock-data';

export const Table: VE.CompClass = (props) => {
  // console.log(props);
  const { compContext } = props;
  const { columns } = compContext?.entityState || {};
  return (
    <div>
      <AntTable columns={columns} dataSource={[]} />
    </div>
  );
};
