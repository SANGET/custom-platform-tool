import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { getPageListServices } from '@provider-app/page-manager/services/apis';

export const PageSelectorLite = ({
  defaultSelectItem,
  onSelect
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = React.useState([defaultSelectItem]);
  const rowSelection = {
    selectedRowKeys,
    type: 'radio',
    onChange: (keys) => {
      onSelect(keys);
      setSelectedRowKeys(keys);
    },
  };

  const [pageList, setPageList] = useState([]);

  useEffect(() => {
    getPageListServices({
      offset: 0,
      size: 10,
      totalSize: true,
    }).then((pageListRes) => {
      setPageList(pageListRes.result?.data);
    });
  }, []);
  return (
    <div>
      <Table
        columns={[
          {
            title: '页面名称',
            dataIndex: 'name',
            width: 200,
            ellipsis: true
          }
        ]}
        rowKey="id"
        rowSelection={rowSelection}
        dataSource={pageList}
      />
    </div>
  );
};
