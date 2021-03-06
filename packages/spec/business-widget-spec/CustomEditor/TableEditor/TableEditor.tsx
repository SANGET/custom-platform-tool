import React from 'react';
import { Button, Input } from '@infra/ui';
import { RegisterEditor } from '@engine/visual-editor/spec';
import { columns as AllColumns, data } from './mock-data';
import { GeneralTableComp } from '../../Widgets';

export class TableEditor extends React.Component<RegisterEditor> {
  state = {
    usingColumn: []
  }

  constructor(props) {
    super(props);

    this.state.usingColumn = this.getDefaultColumns();
  }

  getDefaultColumns = () => {
    const { entityState } = this.props;
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
      <div className="column-selector p-4">
        <span>选择列：</span>
        {
          AllColumns.map((col, idx) => {
          // console.log(col);
            const { title, key } = col;
            const isActive = usingColumn.find((item) => item.key === key);
            return (
              <span
                className={`shadow-sm bg-gray-200 rounded mr10 px-4 py-2 ${isActive ? 't_blue' : ''}`}
                key={key}
                onClick={(e) => this.useCol(col, key)}
              >
                {title}
              </span>
            );
          })
        }
      </div>
    );
  }

  getChangeValue = (currColumns) => {
    return {
      columns: currColumns
    };
  }

  render() {
    const {
      changeEntityState, onSubmit
    } = this.props;
    const { usingColumn } = this.state;
    return (
      <div className="px-4 py-2">
        {this.renderSetColumn()}
        {/* <div className="p10">
          <Button>变量</Button>
        </div> */}
        <GeneralTableComp columns={usingColumn} dataSource={data} />
        <div className="action-area p10">
          <Button
            onClick={(e) => {
              changeEntityState(this.getChangeValue(usingColumn));
              // this.props.modalOptions?.close();
              onSubmit?.();
            }}
          >
          保存
          </Button>
        </div>
      </div>
    );
  }
}
