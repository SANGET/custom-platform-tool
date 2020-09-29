import React, { useEffect, useReducer } from 'react';
import {
  Input, Table, message
} from 'antd';
import { GetDictList } from '../../../api';
import { API_SUCESS_CODE, NOTIFICATION_TYPE, API_ERROR_MSG } from '../../../constant';
import { ModalFooter } from '../../ModalFooter';

const { Search } = Input;

interface IProps {
  onOk: (id: string[], name: string[]) => void;
  onCancel: () => void;
  dictIds: string[]
}
interface IDict {
  id: string,
  name: string
}
const dictReducer = (state, action) => {
  if (action.type === 'changeSome') {
    return { ...state, ...action.name };
  }
};
interface ISelectedRow {
  id: string
  name: string
}
/**
 * 用于实时的数据比对
 * @param arr
 */
const translateArrToMap = (arr: ISelectedRow[]) => {
  const obj = {};
  arr.forEach((item) => {
    const { id, name } = item;
    obj[id] = name;
  });
  return obj;
};
const translateMapToArr = (obj, order: string[]): ISelectedRow[] => {
  return order.map((item) => {
    return { id: item, name: obj?.[item] };
  });
};
const getNameNyId = (menu: ISelectedRow[], id: string) => {
  return menu.filter((item) => item.id === id)?.[0]?.name;
};
const ChooseDict: React.FC<IProps> = (props: IProps) => {
  const { onOk, onCancel, dictIds } = props;
  const type = 'radio';
  const [state, setState] = useReducer(dictReducer, {
    selectedIds: dictIds || [],
    offset: 1,
    size: 10,
    total: 0,
    searchName: '',
    menu: [],
    selectedRows: []
  });
  /** 进行列表数据获取 */
  const getMenuList = async () => {
    const { searchName: name, offset, size } = state;
    const res = await GetDictList({ name, offset, size });
    /** 提示信息 */
    if (res?.code !== API_SUCESS_CODE.GETTABLEINFO) {
      message[NOTIFICATION_TYPE.ERROR](res?.msg || API_ERROR_MSG.GETTABLEINFO);
      return;
    }
    /** 设置数据 */
    setState({
      type: 'changeSome',
      name: {
        menu: res?.result?.data,
        total: res?.result?.total
      }
    });
  };
  useEffect(() => {
    getMenuList();
  }, []);

  const handleOk = () => {
    if ([0, undefined, null].includes(state?.selectedIds?.length)) {
      return message?.[NOTIFICATION_TYPE.WARNING]('请选择一行数据');
    }
    return onOk && onOk(state?.selectedIds, state?.selectedRows?.map((item) => item.name));
  };
  const handleCancel = () => {
    onCancel && onCancel();
  };
  const handleChangePage = (page, pageSize) => {
    setState({
      type: 'changeSome',
      name: {
        offset: page,
        size: pageSize
      }
    });
    getMenuList();
  };

  const handleRowSelect = (selectedIdsTmpl) => {
    const selectedObj = translateArrToMap(state?.selectedRows);
    selectedIdsTmpl.forEach((item) => {
      selectedObj[item] = selectedObj?.[item] || getNameNyId(state.menu, item);
    });
    const selectedRows = translateMapToArr(selectedObj, selectedIdsTmpl);
    setState({ type: 'changeSome', name: { selectedIds: selectedIdsTmpl, selectedRows } });
  };

  const handleRowClick = (selectedIdTmpl: string) => {
    const selectedIdsTmpl1 = state?.selectedIds;
    const index = selectedIdsTmpl1?.indexOf(selectedIdTmpl);
    const selectedIdsTmpl2 = index === -1
      ? [...selectedIdsTmpl1, selectedIdTmpl]
      : [...selectedIdsTmpl1?.slice(0, index), ...selectedIdsTmpl1?.slice(index + 1)];
    handleRowSelect(selectedIdsTmpl2);
  };

  const handleSearch = (value) => {
    setState({
      type: 'changeSome',
      name: {
        searchName: value,
      }
    });
    getMenuList();
  };
  return (
    <>
      <Search
        placeholder="请输入字典名称"
        onSearch={handleSearch}
      />
      <Table
        dataSource={state.menu}
        columns={[
          { title: '序号', render: (text, record, index) => { return `${index + 1}`; } },
          { title: '字典名称', dataIndex: 'name' },
          { title: '字典描述', dataIndex: 'description', render: (text) => { return text || '--'; } }
        ]}
        scroll={{ y: 320 }}
        rowKey={(record) => record.id}
        onRow={(record) => {
          return {
            onClick: () => { handleRowClick(record?.id); }
          };
        }}
        pagination={{
          pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
          total: state.total,
          onChange: handleChangePage,
          onShowSizeChange: handleChangePage
        }}
        rowSelection={{
          selectedRowKeys: state.selectedIds,
          onChange: ((selectedId) => handleRowSelect(selectedId)),
          type,
        }}
      />
      <ModalFooter
        onOk={() => { handleOk(); }}
        onCancel={handleCancel}
      />
    </>
  );
};

export default React.memo(ChooseDict);
