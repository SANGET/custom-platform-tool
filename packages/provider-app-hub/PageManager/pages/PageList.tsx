import React, { useRef, useEffect } from "react";
import { Button, Modal, notification } from "antd";
import { FormInstance } from 'antd/lib/form';
import { onNavigate } from "multiple-page-routing";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { CloseModal, ShowModal } from "@infra/ui";
import ProTable, { ProColumns, ActionType } from "@hy/pro-table";
import Operational from "../components/Operational";
import {
  TABLE_COLUMNS, PAGE_CONFIG, OPERATIONAL_MENU, SELECT_ALL
} from "../constant";
import { ITableItem, IReleaseParams, IOperationalMethods } from "../interface";
import { getPageListServices, delPageServices, releasePageService } from "../services/apis";
import { CreatePage } from "./CreatePage";

const { confirm } = Modal;

interface IProps {
  moduleId: string | null;
}

const PageList: React.FC<IProps> = (props: IProps) => {
  let moduleId: string | null = null;
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  /**
   * 发布页面请求
   * @param data 发布的模块 ID, 页面 ID 数组
   */
  const releasePage = async ({ menuIds, pageInfoIds }:IReleaseParams) => {
    const res = await releasePageService(menuIds, pageInfoIds);
    if (res.code === "00000") {
      notification.success({ message: "发布成功" });
      proTableReload();
    }
  };
  /**
   * 删除页面请求
   * @param id 页面 ID
   */
  const deleteTableSingleLine = async (id: string) => {
    const res = await delPageServices(id);
    if (res.code === "00000") {
      notification.success({ message: "删除成功" });
      proTableReload();
    }
  };
  /**
   * 删除前提示框
   * @param id 页面 ID
   * @param publishedVersion 发布版本，用于展示不同提示语（已发布，未发布）
   */
  const checkBeforeDelete = ({ id, publishedVersion }: ITableItem) => {
    confirm({
      title: publishedVersion ? "页面已发布，是否继续删除。" : "是否确定删除？",
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      onOk: () => { deleteTableSingleLine(id); }
    });
  };
  /**
   * 发布前提示框
   * @param data 发布的模块 ID, 页面 ID 数组
   */
  const checkBeforeRelease = ({ menuIds, pageInfoIds }: IReleaseParams) => {
    confirm({
      title: "是否确定发布？",
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      onOk: () => { releasePage({ menuIds, pageInfoIds }); }
    });
  };
  /**
   * 生成 pro-table 所需 ProColumns 的方法
   * @param methods 操作类型回调函数集合
   */
  const getListColumns = (methods: IOperationalMethods): ProColumns<ITableItem>[] => [
    ...TABLE_COLUMNS,
    {
      title: '操作',
      dataIndex: "action",
      hideInSearch: true,
      fixed: "right",
      width: Number(OPERATIONAL_MENU.length) * 80,
      render: (text, record) => <Operational data={record} methods={methods} />
    },
  ];
  /**
   * 跳转页面设计
   * @param data 跳转信息 ID 和 name
   */
  const goEdit = ({ id, name }) => {
    onNavigate({
      type: "PUSH",
      path: "/page-designer",
      pathExtend: id,
      params: {
        title: name,
        pageID: id
      }
    });
  };
  /**
   * 生成 ProColumns
   */
  const tableColumns = React.useMemo(() => {
    return getListColumns({
      edit: goEdit,
      delete: checkBeforeDelete,
      release: ({ id }) => {
        checkBeforeRelease({ menuIds: [], pageInfoIds: [id] });
      },
    });
  }, []);
  /**
   * 表格数据请求函数
   * @param params 相关请求参数
   */
  const getData = async (params) => {
    const { current, pageSize } = params;
    const tableParams = {
      ...params,
      offset: (current - 1) * pageSize || 0,
      size: pageSize || 10,
      totalSize: true,
      belongToMenuId: moduleId
    };
    const res = await getPageListServices(tableParams);
    const { data, total } = res?.result || {};
    return Promise.resolve({
      data: Array.isArray(data) ? data.reduce((a, b) => {
        a.push({
          ...b,
          belongMenus: b.belongMenus.map((item) => item.menuName),
          dataSources: b.dataSources.map((item) => item.datasourceName),
        });
        return a;
      }, []) : [],
      success: true,
      total: total || 0
    });
  };
  /**
   * 表格刷新
   */
  const proTableReload = () => {
    actionRef?.current?.reload();
  };
  /**
   * 渲染表格工具栏
   */
  const renderToolBarRender = () => [
    <Button
      key="1" type="primary" onClick={() => {
        const modalID = ShowModal({
          title: '创建页面',
          width: 700,
          children: () => {
            return (
              <div className="p20">
                <CreatePage
                  onSuccess={(item) => {
                    CloseModal(modalID);
                    proTableReload();
                    goEdit(item);
                  }}
                />
              </div>
            );
          }
        });
      }}
    >
      自定义页面
    </Button>
  ];
  useEffect(() => {
    if (props.moduleId) {
      moduleId = props.moduleId === SELECT_ALL ? null : props.moduleId;
      proTableReload();
    }
  }, [props.moduleId]);

  return (
    <>
      <ProTable<ITableItem>
        request={getData}
        search={{
          searchText: "搜索",
          resetText: "清空",
          collapsed: false,
          collapseRender: () => ""
        }}
        actionRef={actionRef}
        formRef={formRef}
        columns={tableColumns}
        rowKey="id"
        scroll={{ x: 500 }}
        toolBarRender={renderToolBarRender}
        pagination={{
          hideOnSinglePage: true,
          pageSizeOptions: PAGE_CONFIG.SIZE_OPTIONS,
          pageSize: PAGE_CONFIG.SIZE
        }}
      />
    </>
  );
};

export default PageList;
