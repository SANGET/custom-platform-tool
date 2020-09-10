import React from 'react';
import { Table as AntTable } from 'antd';

import { columns, data } from './mock-data';

export const Table = (props) => {
  return (
    <div>
      <AntTable columns={columns} dataSource={data} />
    </div>
  );
};
