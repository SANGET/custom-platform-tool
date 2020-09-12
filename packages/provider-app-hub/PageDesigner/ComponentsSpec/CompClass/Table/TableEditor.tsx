import React from 'react';
import { Button, Input } from '@infra/ui';
import { Table as AntTable } from 'antd';
import { RegisterEditor } from '@engine/visual-editor/spec';
import { columns as AllColumns, data } from './mock-data';

export default class TableEditor extends React.Component<RegisterEditor> {
  state = {
    usingColumn: []
  }

  constructor(props) {
    super(props);

    this.state.usingColumn = this.getDefaultColumns();
  }

  getDefaultColumns = () => {
    const { entityState } = this.props.compContext;
    const { columns = [] } = entityState || {};
    return columns;
  }

  useCol = (item, key) => {
    const { usingColumn } = this.state;
    const itemIdx = usingColumn.findIndex((col) => col.key === key);
    const nextState = [...usingColumn];
    if (itemIdx === -1) {
      nextState.push(item);
    } else {
      nextState.splice(itemIdx, 1);
    }
    this.setState({
      usingColumn: nextState
    });
  }

  renderSetColumn = () => {
    const { usingColumn } = this.state;
    return (
      <div>{
        AllColumns.map((col, idx) => {
          // console.log(col);
          const { title, key } = col;
          const isActive = usingColumn.find((item) => item.key === key);
          return (
            <span
              className={`p10 ${isActive ? 't_blue' : ''}`}
              key={key}
              onClick={(e) => this.useCol(col, key)}
            >
              {title}
            </span>
          );
        })
      }</div>
    );
  }

  getChangeValue = (currColumns) => {
    return {
      columns: currColumns
    };
  }

  render() {
    const {
      onChange
    } = this.props;
    const { usingColumn } = this.state;
    return (
      <div>
        {this.renderSetColumn()}
        <AntTable columns={usingColumn} dataSource={data} />
        <div className="action-area p10">
          <Button
            onClick={(e) => {
              onChange(this.getChangeValue(usingColumn));
            }}
          >
          保存
          </Button>
        </div>
      </div>
    );
  }
}
