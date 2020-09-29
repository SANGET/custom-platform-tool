import React, { useEffect, useState } from 'react';
import { queryTableListService } from '@provider-app/table-structure/service';
import { Table, Button } from 'antd';

interface SubmitItem {
  id: string
  type: string
}

interface DataSourceBinderProps {
  onSubmit: (submitItems: SubmitItem[]) => void
  bindedDataSources: any[]
}

interface TableList {
  paging: {
    offset: number
    size: number
    total?: number
  }
  list: any[]
}
const useTableList = (defaultPaging = {
  offset: 0,
  size: 10
}): [TableList, (paging?: TableList['paging']) => void] => {
  const [tableList, setList] = useState<TableList>({
    paging: defaultPaging,
    list: []
  });
  const getListByPaging = (pagingOptions = defaultPaging) => {
    const { offset = 0, size = tableList.paging.size } = pagingOptions;
    queryTableListService(pagingOptions).then((resData) => {
      const { total, data } = resData?.result || {};
      setList({
        paging: {
          offset,
          size,
          total
        },
        list: data
      });
    });
  };
  useEffect(() => {
    getListByPaging();
  }, []);
  return [tableList, getListByPaging];
};

const columns = [
  {
    key: 'name',
    dataIndex: 'name',
    title: '表结构名称',
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: '是否带入附属表',
  },
];

const getItem = (dataSource, ids: string[]) => {
  const res: any[] = [];
  ids.forEach((id) => {
    const item = dataSource.find((item) => item.id === id);
    res.push(item);
  });
  return res;
};

const useTableSelection = (defaultValue: string[] = []): [any, (selection) => void] => {
  const [selection, setSelection] = useState(defaultValue);
  return [selection, setSelection];
};

/**
 * 获取默认的 dataSource 数据
 * @param bindedDataSources
 */
const getDefaultDataSourceData = (bindedDataSources: any[] = []) => {
  const res: string[] = [];
  bindedDataSources.forEach((item) => res.push(item.id));
  return res;
};

export const DataSourceBinder: React.FC<DataSourceBinderProps> = (props) => {
  const { bindedDataSources, onSubmit } = props;
  const [tableList, getTableList] = useTableList();
  const [selectedRowKeys, onSelectChange] = useTableSelection(
    getDefaultDataSourceData(bindedDataSources)
  );
  // console.log(tableList);
  const { list, paging } = tableList;
  const tablePaging = {
    current: paging.offset + 1,
    total: paging.total,
    pageSize: paging.size,
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <div className="data-source-binder p20">
      <Table
        rowKey="id"
        size="small"
        onChange={(pagination) => {
          // console.log(pagination);
          getTableList({
            offset: pagination.current - 1,
            size: pagination.pageSize,
          });
        }}
        columns={columns}
        dataSource={list}
        pagination={tablePaging}
        rowSelection={rowSelection}
      />
      <Button
        onClick={(e) => {
          const submitData = getItem(list, selectedRowKeys);
          // console.log(submitData);
          onSubmit(submitData);
        }}
      >
        确定
      </Button>
    </div>
  );
};
