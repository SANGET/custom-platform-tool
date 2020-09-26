import React from 'react';
import { Table as AntTable } from 'antd';

export const NormalTableComp = (props) => {
  // console.log(props);
  const { columns } = props || {};
  return (
    <div>
      <AntTable columns={columns} dataSource={[]} />
    </div>
  );
};
