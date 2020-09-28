import React, { useState, useEffect } from 'react';
import {
  Input, Table, message
} from 'antd';
import { GetDictList } from '../../../api';
import { API_SUCESS_CODE, NOTIFICATION_TYPE, API_ERROR_MSG } from '../../../constant';
import { ModalFooter } from '../../ModalFooter';

const { Search } = Input;

interface IProps {
  onOk: (id: string, name: string) => void;
  onCancel: () => void;
  dictId: string
}
interface IDict {
  id: string,
  name: string
}
const ChooseDict: React.FC<IProps> = (props: IProps) => {
  const { onOk, onCancel, dictId } = props;
  const [dictObj, setDictObj] = useState({ id: '', name: '' });
  const [offset, setMenuSize] = useState(1);
  const [size, setMenuPage] = useState(10);
  const [menuTotal, setMenuTotal] = useState(0);
  const [name, setDictName] = useState('');
  const [dictMenu, setDictMenu] = useState<IDict[]>([]);
  const rowKeysDefault = dictId ? [dictId] : [];
  const [selectedRowKeys, setSelectedRowKeys] = useState(rowKeysDefault);
  const getMenuList = async () => {
    const res = await GetDictList({ name, offset, size });
    /** 提示信息 */
    if (res?.code !== API_SUCESS_CODE.GETTABLEINFO) {
      return message[NOTIFICATION_TYPE.ERROR](res?.msg || API_ERROR_MSG.GETTABLEINFO);
    }
    /** 设置数据 */
    setDictMenu(res?.result?.data);
    /** 设置总行数 */
    return setMenuTotal(res?.result?.total);
  };
  useEffect(() => {
    getMenuList();
  }, []);

  const handleOk = () => {
    const id = dictObj?.id;
    const dictName = dictObj?.name;
    if (!id) {
      return message?.[NOTIFICATION_TYPE.WARNING]('请选择一行数据');
    }
    return onOk && onOk(id, dictName);
  };
  const handleCancel = () => {
    onCancel && onCancel();
  };
  const handleChangePage = (page, pageSize) => {
    setMenuPage(page);
    setMenuSize(pageSize);
    getMenuList();
  };
  const handleRowSelect = (selectedRowKeysTmpl) => {
    setSelectedRowKeys(selectedRowKeysTmpl);
  };
  return (
    <>
      <Search
        placeholder="请输入字典名称"
        onSearch={(value) => {
          setDictName(value);
          getMenuList();
        }}
      />
      <Table
        dataSource={dictMenu}
        columns={[
          { title: '序号', render: (text, record, index) => { return `${index + 1}`; } },
          { title: '字典名称', dataIndex: 'name' },
          { title: '字典描述', dataIndex: 'description', render: (text) => { return text || '--'; } }
        ]}
        scroll={{ y: 320 }}
        rowKey={(record) => record.id}
        onRow={(record) => {
          return {
            onClick: () => {
              handleRowSelect([record?.id]);
              setDictObj({ id: record?.id, name: record?.name });
            }
          };
        }}
        pagination={{
          pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
          total: menuTotal,
          onChange: handleChangePage,
          onShowSizeChange: handleChangePage
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: handleRowSelect,
          type: 'radio',
          hideSelectAll: true,
          renderCell: () => { return null; }
        }}
      />
      <ModalFooter
        onOk={handleOk}
        onCancel={handleCancel}
      />
    </>
  );
};

export default React.memo(ChooseDict);
