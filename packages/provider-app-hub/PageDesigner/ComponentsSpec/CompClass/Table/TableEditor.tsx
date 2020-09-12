import React from 'react';
import { Input } from '@infra/ui';
import { Table as AntTable } from 'antd';
import { columns, data } from './mock-data';

export default class TableEditor extends React.Component {
  render() {
    const {
      onChange
    } = this.props;
    return (
      <div>
        <AntTable columns={columns} dataSource={data} />
      </div>
    );
  }
}
