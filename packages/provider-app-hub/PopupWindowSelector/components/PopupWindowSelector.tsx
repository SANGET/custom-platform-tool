import React, { useRef, useState, useEffect } from 'react';
import ProTable, { ProColumns } from '@hy/pro-table';
import {
  Button, Modal, notification, Dropdown, Menu
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';
import { onNavigate } from 'multiple-page-routing';
import { queryPopupWindowListService, allowDeletePopupWindowService, deletePopupWindowService } from '../service';
import {
  COLUMNS, OPERATIONALMENU, SELECT_ALL, MORE_MENU, PAGE_SIZE_OPTIONS
} from '../constant';
import Operational from './Operational';
import { IStatus } from '../interface';
import CreateModal from './CreateModal';
import CreateTable from './CreatePopupWindow';
import CopyTable from './CopyPopupWindow';

const { confirm } = Modal;

interface IProps {
  showType: string;
  updataMenus: () => void;
}
interface ActionType {
  reload: () => void;
  fetchMore: () => void;
  reset: () => void;
}

export interface ICopyData {
  id?: string;
  name?: string;
  code?: string;
}

const PopupWindowSelector: React.FC<IProps> = (props: IProps, ref) => {
  let showType = "";
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [copyData = {}, setCopyData] = useState<ICopyData>();
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
    if (props.showType) {
      showType = props.showType === SELECT_ALL ? "" : props.showType;
      proTableReset();
      fromReset();
    }
  }, [props.showType]);
  const handleMenuClick = ({ key }) => {
    console.dir(key);
    if (key === "dictionary") {
      onNavigate({
        type: "PUSH",
        path: '/DictManage',
      });
    }
  };
  const getData = async (params, sorter, filter) => {
    const { current, pageSize } = params;
    const tableParmas = {
      ...params,
      offset: (current - 1) * pageSize || 0,
      size: pageSize || 10,
      showType
    };
    let dtoShowType = "1";
    let dtoSelectType = "1";
    showType = showType.toString();
    if (showType === '') { dtoShowType = ""; dtoSelectType = ""; }
    if (showType === '10') { dtoShowType = "1"; dtoSelectType = "1"; }
    if (showType === '20') { dtoShowType = "2"; dtoSelectType = "1"; }
    if (showType === '30') { dtoShowType = "3"; dtoSelectType = "1"; }
    if (showType === '11') { dtoShowType = "1"; dtoSelectType = "1"; }
    if (showType === '12') { dtoShowType = "1"; dtoSelectType = "2"; }
    if (showType === '21') { dtoShowType = "2"; dtoSelectType = "1"; }
    if (showType === '22') { dtoShowType = "2"; dtoSelectType = "2"; }
    if (showType === '31') { dtoShowType = "3"; dtoSelectType = "1"; }
    if (showType === '32') { dtoShowType = "3"; dtoSelectType = "2"; }
    tableParmas.showType = dtoShowType;
    tableParmas.selectType = dtoSelectType;

    const res = await queryPopupWindowListService(tableParmas);
    const { data, total } = res.result;
    return Promise.resolve({
      data: data || [],
      success: true,
      total: total || 0
    });
  };
  const handleTableOperational = async (item) => {
    const {
      operate, id, name, code
    } = item;
    if (operate === "edit") {
      onNavigate({
        type: "PUSH",
        path: `/table-info`,
        pathExtend: id,
        params: { id, title: `编辑表_${name}` }
      });
    } else if (operate === "delete") {
      checkBeforeDelete(id);
    } else if (operate === "copy") {
      setCopyData({ id, name, code });
      setVisibleCopyModal(true);
    }
  };
  const checkBeforeDelete = async (id: string) => {
    const res = await allowDeletePopupWindowService(id);
    if (res.code === "00000") {
      if (res.result) {
        confirm({
          title: res.result,
          icon: <ExclamationCircleOutlined />,
          okText: '确定',
          cancelText: '取消',
          onOk: () => { deleteTableSingleLine(id); }
        });
      } else {
        deleteTableSingleLine(id);
      }
    } else {
      openNotification("error", res.msg);
    }
  };
  const deleteTableSingleLine = async (id: string) => {
    const res = await deletePopupWindowService(id);
    if (res.code === "00000") {
      openNotification("success", "删除成功");
      proTableReload();
    } else {
      openNotification("error", "删除失败");
    }
  };
  const openNotification = (type: IStatus, msg = "", description = "") => {
    notification[type]({
      message: msg,
      description
    });
  };
  const proTableReload = () => {
    actionRef?.current?.reload();
  };
  const proTableReset = () => {
    actionRef?.current?.reload();
  };
  const fromReset = () => {
    formRef.current?.resetFields();
  };
  const handleCratetTableOk = () => {
    setVisibleCrateTableModal(false);
    proTableReload();
  };
  const handleCopyTableOk = () => {
    setVisibleCopyModal(false);
    proTableReload();
  };
  const handleUpdataMenus = () => {
    props.updataMenus && props.updataMenus();
  };
  const renderMenu = () => <Menu onClick={handleMenuClick}>
    {
      MORE_MENU.map((item) => <Menu.Item key={item.key} >
        {item.title}
      </Menu.Item>)
    }
  </Menu>;
  const renderToolBarRender = () => [
    <Button key="3" type="primary" onClick={() => setVisibleCrateTableModal(true)}>
      新建表
    </Button>,
    <Dropdown overlay={renderMenu}>
      <Button type="primary">
        更多按钮 <DownOutlined />
      </Button>
    </Dropdown>
  ];
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
          pageSizeOptions: PAGE_SIZE_OPTIONS
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
};

export default React.memo(PopupWindowSelector);
