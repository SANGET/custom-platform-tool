import React, {
  useRef, useState, useEffect, useReducer
} from 'react';
import ProTable, { ProColumns } from '@hy/pro-table';
import {
  Button, Modal, notification, Dropdown, Menu
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';
import { onNavigate } from 'multiple-page-routing';
import {
  queryPopupWindowListService, allowDeletePopupWindowService, deletePopupWindowService, queryPopupWindowService
} from '../service';
import {
  COLUMNS, OPERATIONALMENU, SELECT_ALL, MORE_MENU, PAGE_SIZE_OPTIONS, IPopupWindow, IModalData, SHOW_TYPE_OPTIONS, SELECT_TYPE_OPTIONS, IEditPopupWindowProps,

} from '../constant';
import Operational from './Operational';
import { IOperationalMenuItemKeys, IStatus, OperationalOperate } from '../interface';
import CreateModal from './CreateModal';
import CreateEditPopupWindow from './CreateEditPopupWindow';
import PreviewTable from './PreviewPopupWindow';

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

export interface IPreviewData {
  id?: string;
  name?: string;
  code?: string;
}
// /** 弹窗编辑的弹窗的数据操作 */
// const useModalConfig = () => {
//   const [modalConfig, setModalConfig] = useReducer((state, action) => {
//     if (action.type === 'changeSome') {
//       return {
//         ...state, ...action.name
//       };
//     }
//     return state;
//   }, {
//     modalVisible: false,
//     modalTitle: '',
//     showDictionaryConfig: true,
//     operateParam: {},
//     handleAft: () => {}
//   });
//   return [modalConfig, setModalConfig];
// };

const getShowTypeTitleById = (showTypeId: number) => {
  return SHOW_TYPE_OPTIONS.filter((item) => showTypeId === item.id)?.[0]?.title;
};
const getShowTypeIdByTitle = (showTypeTitle: string) => {
  console.log(SHOW_TYPE_OPTIONS.filter((item) => item.title === showTypeTitle)?.[0]?.id);
  return SHOW_TYPE_OPTIONS.filter((item) => item.title === showTypeTitle)?.[0]?.id;
};

const getSelectTypeTitleById = (selectTypeId: number) => {
  return SELECT_TYPE_OPTIONS.filter((item) => selectTypeId === item.id)?.[0]?.title;
};
const getSelectTypeIdByTitle = (selectTypeTitle: string) => {
  console.log(SELECT_TYPE_OPTIONS.filter((item) => item.title === selectTypeTitle)?.[0]?.id);
  return SELECT_TYPE_OPTIONS.filter((item) => item.title === selectTypeTitle)?.[0]?.id;
};

const PopupWindowSelector: React.FC<IProps> = (props: IProps, ref) => {
  let showType = "";
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [previewData = {}, setPreviewData] = useState<IPreviewData>();
  const [previewModalData = {}, setPreviewModalData] = useState<IModalData>();
  const [editData = {}, setEditData] = useState<IPopupWindow>();
  const [editModalData = {}, setEditModalData] = useState<IModalData>();
  const [visiblePreviewModal, setVisiblePreviewModal] = useState<boolean>(false);
  const [visibleCreateEditModal, setvisibleCreateEditModal] = useState<boolean>(false);
  // const [modalConfig, setModalConfig] = useModalConfig();

  const tableOperational: ProColumns = {
    title: '操作',
    dataIndex: 'operCol',
    fixed: 'right',
    hideInSearch: true,
    width: OPERATIONALMENU.length * 80,
    render: (row, record, index) => <Operational data={record} onClick={handlePopupWindowOperational} />
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
      totalSize: true,
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
  const getInitEditPopupWinndow: IPopupWindow = () => {
    const ret: IPopupWindow = {
      id: '',
      code: '',
      name: '',
      showType: '',
      selectType: '',
      selectCount: '',
      enable: '',
      tablePopupWindowDetail: {
        createdBy: '',
        datasource: 0,
        datasourceType: 0,
        deleteFlag: '',
        gmtCreate: '',
        gmtModified: '',
        id: '',
        modifiedBy: '',
        returnText: '',
        returnValue: '',
        showColumn: '',
        sortColumnInfo: '',
      },
      treePopupWindowDetail: {
        createdBy: '',
        datasource: 0,
        datasourceType: 0,
        deleteFlag: '',
        gmtCreate: '',
        gmtModified: '',
        id: '',
        modifiedBy: '',
        relatedSuperiorColumn: '',
        returnText: '',
        returnValue: '',
        showColumn: '',
        showSearch: '',
        sortColumnInfo: '',
        superiorColumn: '',
      },

      treeTablePopupWindowDetail: {
        createdBy: '',
        deleteFlag: '',
        gmtCreate: '',
        gmtModified: '',
        id: '',
        modifiedBy: '',
        popupWindowId: '',
        showSearch: '',
        tableDatasource: '',
        tableDatasourceType: '',
        tableReturnText: '',
        tableReturnValue: '',
        tableShowColumn: '',
        tableSortInfo: '',
        tableTreeRelatedColumn: '',
        treeDatasource: '',
        treeDatasourceType: '',
        treeRelatedSuperiorColumn: '',
        treeReturnText: '',
        treeReturnValue: '',
        treeShowColumn: '',
        treeSortInfo: '',
        treeSuperiorColumn: '',
        version: '',
      },
      customPopupWindowDetail: {
        createdBy: '',
        deleteFlag: '',
        gmtCreate: '',
        gmtModified: '',
        id: '',
        modifiedBy: '',
        popupWindowId: '',

      }
    };
    return ret;
  };
  const handlePopupWindowOperational = async (item,) => {
    const {
      [IOperationalMenuItemKeys.operate]: operate, id, name, code
    } = item;

    if (operate === OperationalOperate.edit) {
      if (!id) {
        return;
      }
      queryPopupWindowService(id).then((res) => {
      /** 如果接口没有提供提示信息 */
        if (!res?.msg) {
          openNotification('error', 'data error');
        }
        console.log(res);
        setEditModalData({ modalTitle: '编辑弹窗', okText: '保存', });
        const initEditData = getInitEditPopupWinndow();
        const retEditData = res?.result;

        if (!res?.result.tablePopupWindowDetail) {
          retEditData.tablePopupWindowDetail = initEditData.tablePopupWindowDetail;
        }
        if (!res?.result.treePopupWindowDetail) {
          retEditData.treePopupWindowDetail = initEditData.treePopupWindowDetail;
        }
        if (!res?.result.treeTablePopupWindowDetail) {
          retEditData.treeTablePopupWindowDetail = initEditData.treeTablePopupWindowDetail;
        }

        console.log(retEditData);
        // temp = Object.assign(temp, res?.result);
        setEditData(retEditData);
        // setEditData(res?.result);
        setvisibleCreateEditModal(true);
      });
    } else if (operate === "delete") {
      // checkBeforeDelete(id);
      deleteTableSingleLine(id);
    } else if (operate === "preview") {
      if (!id) {
        return;
      }
      queryPopupWindowService(id).then((res) => {
        /** 如果接口没有提供提示信息 */
        if (!res?.msg) {
          openNotification('error', 'data error');
        }
        setPreviewModalData({ modalTitle: '预览弹窗', okText: '保存', });
        setPreviewData(res?.result);
        setVisiblePreviewModal(true);
      });
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
    setvisibleCreateEditModal(false);
    proTableReload();
  };
  const handlePreviewTableOk = () => {
    setVisiblePreviewModal(false);
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
    <Button
      key="3" type="primary" onClick={() => {
        setEditModalData({ modalTitle: '新建弹窗', okText: '开始创建弹窗' });
        setEditData(getInitEditPopupWinndow());
        setvisibleCreateEditModal(true);
      }}
    >
      新建弹窗
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
        title={editModalData.modalTitle}
        modalVisible={visibleCreateEditModal}
        onCancel={() => setvisibleCreateEditModal(false)}
      >
        <CreateEditPopupWindow
          onOk={handleCratetTableOk}
          onCancel={() => setvisibleCreateEditModal(false)}
          upDataMenus={handleUpdataMenus}
          editData = {editData}
          editModalData = {editModalData}
        />
      </CreateModal>
      <CreateModal
        title="预览弹窗"
        modalVisible={visiblePreviewModal}
        onCancel={() => setVisiblePreviewModal(false)}
      >
        <PreviewTable
          previewModalData={previewModalData}
          previewData={previewData}
          onOk={handlePreviewTableOk}
          onCancel={() => setVisiblePreviewModal(false)}
        />
      </CreateModal>
    </>
  );
};

export default React.memo(PopupWindowSelector);
