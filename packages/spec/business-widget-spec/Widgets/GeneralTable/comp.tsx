import React from 'react';
import { Table as AntTable } from 'antd';

export interface NormalTableCompProps {
  columns: any[]
  dataSource: any[]
}

export const NormalTableComp: React.FC<NormalTableCompProps> = (props) => {
  // console.log(props);
  const { columns, dataSource = [] } = props || {};
  return (
    <div>
      <AntTable columns={columns} dataSource={dataSource} />
    </div>
  );
};
