import React from 'react';
import { Table } from 'antd';

const { ColumnGroup, Column, Summary } = Table;

const HyTable = ({
  dataSource, rowKey, children,
  ...otherProps
}) => {
  return (
    <Table
      dataSource={dataSource} rowKey={rowKey}
      {...otherProps}
    >
      {children}
    </Table>
  );
};

const HyTableColumn = ({ ...props }) => {
  return (<Column {...props} />);
};

const HyTableColumnGroup = ({ children, ...props }) => {
  return (<ColumnGroup {...props} >{children}</ColumnGroup>);
};

export {
  HyTable,
  HyTableColumn,
  HyTableColumnGroup
};
