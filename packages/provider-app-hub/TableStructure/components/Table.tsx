import React, { useRef, useState, useEffect } from 'react';
import ProTable, { ProColumns } from '@hy/pro-table';
import { Button, Modal, notification, Dropdown, Menu } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';
import { queryTableListService, allowDeleteTableService, deleteTableService } from '../service';
import { COLUMNS, OPERATIONALMENU, SELECT_ALL, MORE_MENU } from '../constant';
import Operational from './Operational';
import { onNavigate } from 'multiple-page-routing';
import { IStatus } from '../interface';
import CreateModal from './CreateModal';
import CreateTable from './CreateTable';
import CopyTable from './CopyTable';
const { confirm } = Modal;

interface IProps {
  moduleId: string;
  updataMenus: () => void;
}
interface ActionType {
  reload: () => void;
  fetchMore: () => void;
  reset: () => void;
}

interface ICopyData {
  id: string;
  name: string;
  code: string;
}

const Table: React.FC<IProps> = (props: IProps, ref) => {
  let moduleId: string = "";
  let actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [copyData, setCopyData] = useState<ICopyData>();
  const [visibleCopyModal, setVisibleCopyModal] = useState<boolean>(false);
  const [visibleCrateTableModal, setVisibleCrateTableModal] = useState<boolean>(false);

  const tableOperational: ProColumns = {
    title: '操作',
    dataIndex: 'operCol',
    fixed: 'right',
    hideInSearch: true,
    width: OPERATIONALMENU.length * 80,
    render: (row, record, index) => <Operational data={record} onClick={handleTableOperational} />
  };
  const columns = [...COLUMNS, tableOperational];
  useEffect(() => {
    if (props.moduleId) {
      moduleId = props.moduleId === SELECT_ALL ? "" : props.moduleId;
      proTableReset();
      fromReset();
    }
  }, [props.moduleId])
  const handleMenuClick = ({ key }) => {
    console.dir(key)
    if (key === "dictionary") {
      onNavigate({
        type: "PUSH",
        route: '/DictManage',
      });
    }
  }
  const getData = async (params, sorter, filter) => {
    const { current, pageSize } = params;
    const tableParmas = {
      ...params,
      offset: (current - 1) * pageSize || 0,
      size: pageSize || 10,
      moduleId
    }
    const res = await queryTableListService(tableParmas)
    const { data, total } = res.result;
    return Promise.resolve({
      data: data || [],
      success: true,
      total: total || 0
    })
  }
  const handleTableOperational = async (item) => {
    const { operate, id, name, code } = item
    if (operate === "edit") {
      onNavigate({
        type: "PUSH",
        route: '/data_designer/edit_struct',
        params: { id, title: '编辑表' }
      });
    } else if (operate === "delete") {
      checkBeforeDelete(id)
    } else if (operate === "copy") {
      setCopyData({ id, name, code })
      setVisibleCopyModal(true)
    }
  }
  const checkBeforeDelete = async (id: string) => {
    const res = await allowDeleteTableService(id)
    if (res.code === "00000") {
      if (res.result) {
        confirm({
          title: res.result,
          icon: <ExclamationCircleOutlined />,
          okText: '确定',
          cancelText: '取消',
          onOk: () => { deleteTableSingleLine(id) }
        })
      } else {
        deleteTableSingleLine(id)
      }
    } else {
      openNotification("error", "删除失败")
    }
  }
  const deleteTableSingleLine = async (id: string) => {
    const res = await deleteTableService(id)
    if (res.code === "00000") {
      openNotification("success", "删除成功")
      proTableReload()
    } else {
      openNotification("error", "删除失败")
    }
  }
  const openNotification = (type: IStatus, msg: string = "", description: string = "") => {
    notification[type]({
      message: msg,
      description: description
    });
  }
  const proTableReload = () => {
    actionRef?.current?.reload();
  }
  const proTableReset = () => {
    actionRef?.current?.reload();
  }
  const fromReset = () => {
    formRef.current?.resetFields()
  }
  const handleCratetTableOk = () => {
    setVisibleCrateTableModal(false);
    proTableReload();
  }
  const handleCopyTableOk = () => {
    setVisibleCopyModal(false);
    proTableReload();
  }
  const handleUpdataMenus = () => {
    props.updataMenus && props.updataMenus()
  }
  const renderMenu = () =>
    <Menu onClick={handleMenuClick}>
      {
        MORE_MENU.map(item =>
          <Menu.Item key={item.key} >
            {item.title}
          </Menu.Item>)
      }
    </Menu>
  const renderToolBarRender = () => [
    <Button key="3" type="primary" onClick={() => setVisibleCrateTableModal(true)}>
      新建表
    </Button>,
    <Dropdown overlay={renderMenu}>
      <Button type="primary">
        更多按钮 <DownOutlined />
      </Button>
    </Dropdown>
  ]
  return (
    <>
      <ProTable
        request={getData}
        search={{
          searchText: "搜索",
          resetText: "清空",
          collapsed: false,
          collapseRender: () => ""
        }}
        actionRef={actionRef}
        formRef={formRef}
        columns={columns}
        rowKey="id"
        scroll={{ x: '500px' }}
        toolBarRender={renderToolBarRender}
        pagination={{
          hideOnSinglePage: true,
        }}
      />
      <CreateModal
        title="新建数据表"
        modalVisible={visibleCrateTableModal}
        onCancel={() => setVisibleCrateTableModal(false)}
      >
        <CreateTable
          onOk={handleCratetTableOk}
          onCancel={() => setVisibleCrateTableModal(false)}
          upDataMenus={handleUpdataMenus}
        />
      </CreateModal>
      <CreateModal
        title="复制数据表"
        modalVisible={visibleCopyModal}
        onCancel={() => setVisibleCopyModal(false)}
      >
        <CopyTable
          data={copyData}
          onOk={handleCopyTableOk}
          onCancel={() => setVisibleCopyModal(false)}
        />
      </CreateModal>
    </>
  );
}

export default React.memo(Table);
