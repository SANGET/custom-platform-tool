import React from 'react';
import { Table } from 'antd';

const useTableSelection = (defaultValue: string[] = []): [any, (selection) => void] => {
  const [selection, setSelection] = useState(defaultValue);
  return [selection, setSelection];
};

export const PageSelectorLite = ({
  onSelect
}) => {
  const [selectedRowKeys, onSelectChange] = useTableSelection(
    getDefaultDataSourceData(bindedDataSources)
  );
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <div>
      <Table
        rowSelection={rowSelection}
        columns={[
          {
            title: '页面名称',
            dataIndex: 'name',
            width: 200,
            ellipsis: true
          },
        ]}
      />
    </div>
  );
};
