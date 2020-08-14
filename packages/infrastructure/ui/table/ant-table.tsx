import React from 'react';
import { Table, Tag, Space } from 'antd';

const { Column, ColumnGroup } = Table;

const BTable = ({ dataSource, columnsInfo, ...args }) => {
  return (
    <Table
      rowKey="sdId1"
      dataSource={dataSource}
      pagination={false} key='dhkljk'
      columns={columnsInfo}
      {...args}
    >
      {
        // columnsInfo.map((_, i) => <Column title={_.title} dataIndex={_.key} key={i} />)
      }
    </Table>
  );
};

export default BTable;
