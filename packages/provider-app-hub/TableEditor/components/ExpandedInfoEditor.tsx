import React from 'react';
import { Table, Form } from 'antd';
import lodash from 'lodash';
import { ROW_SELECT_TYPE } from '../constants';

class ExpandedInfoEditor extends React.Component {
  state: {
    selectedRowKeys: string[]
  } = {
    selectedRowKeys: []
  }

  selectType = ROW_SELECT_TYPE.RADIO

  setNewSelectedRowKeys = (rowKey: string) => {
    let { selectedRowKeys } = this.state;
    if (this.selectType === ROW_SELECT_TYPE.CHECKBOX) {
      selectedRowKeys = selectedRowKeys.includes(rowKey)
        ? lodash.without(selectedRowKeys, rowKey)
        : [...selectedRowKeys, rowKey];
    } else {
      selectedRowKeys = [rowKey];
    }
    this.setState({
      selectedRowKeys
    });
  }

  resetSelectedRowKeys = (selectedRowKeys: string[]) => {
    this.setState({
      selectedRowKeys
    });
  }

  render() {
    const {
      title, actionAreaRenderer, columns, dataSource,
      blurRow, clickRow, doubleClickRow, formRef, changeValue
    } = this.props;
    const { selectedRowKeys } = this.state;
    return (
      <div className="common-table">
        <div className="t-header flex">
          <div className="title">{title}</div>
          <span className="flex"></span>
          <div className="action-area">
            {actionAreaRenderer(selectedRowKeys)}
          </div>
        </div>
        <div className="t-body">
          <Form
            ref={formRef}
            onValuesChange = {changeValue}
          >
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              rowKey='id'
              rowSelection = {{
                type: 'radio',
                selectedRowKeys,
                hideSelectAll: true,
                fixed: true
              }}
              onRow={(record, index) => {
                return {
                  onBlur: (event) => { blurRow(record, index); },
                  onDoubleClick: (event) => {
                    doubleClickRow(record, index);
                    event.stopPropagation();
                  },
                  onClick: (event) => {
                    this.setNewSelectedRowKeys(record.id);
                    clickRow && clickRow();
                  }
                };
              }}
            />
          </Form>
        </div>
      </div>
    );
  }
}
export default ExpandedInfoEditor;
