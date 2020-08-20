import React from 'react';
import { Input } from '@infra/ui';

export class TableEditor extends React.Component {
  render() {
    const {
      onChange
    } = this.props;
    return (
      <div>
        编辑表格
        <Input onChange={onChange} />
      </div>
    );
  }
}
