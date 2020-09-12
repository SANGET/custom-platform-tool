import ProTable, { ProColumns } from '@hy/pro-table';
import React, { PureComponent } from 'react';
import { Button, notification, Row, Col, Card } from 'antd';
import { COLUMNS, OPERATIONALMENU, DEFAULT_PAGE_SISE, TABLE_TYPE } from './constant';
import Operational from './components/Operational';
import { queryTableListService, deleteTableService } from './service';
// import CreateTableModal from './components/createTableModal'
import { IStatus } from './interface';
import CreateTable from './components/CreateTable';
import CreateModal from './components/CreateModal'
import CopyTable from './components/CopyTable';
import MeunsTree from './components/MenusTree';
import "./index.less"
import { onNavigate } from 'multiple-page-routing';
interface ITableParams {
  /** 数据表名称 */
  name?: string;
  /** 模块主键 */
  moduleId?: string;

  /**表类型  */
  type?: TABLE_TYPE;

  /** 分页查询起始位置,从0开始 */
  offset?: number;

  /** 每页查询记录数 */
  size?: number;

}
interface IProps {

}
interface ICopyData {
  id?: string;
  name?: string;
  code?: string
}
interface IState {
  tableParmas: ITableParams;
  visibleModal: boolean;
  visibleCopyModal: boolean;
  copyData: ICopyData;
}
class DataDesign extends PureComponent<IProps, IState>{
  public columns: ProColumns[] = [];


  public proTabRef: any = {};

  /** table 操作项 columns */
  public tableOperational: ProColumns = {
    title: '操作',
    dataIndex: 'operCol',
    fixed: 'right',
    hideInSearch: true,
    width: OPERATIONALMENU.length * 80,
    render: (row, record, index) => <Operational data={record} onClick={this.handleTableOperational} />
  };

  constructor(props: IProps) {
    super(props);
    this.columns = [...COLUMNS, this.tableOperational]
    this.state = {
      visibleModal: false,
      visibleCopyModal: false,
      copyData: {},
      tableParmas: {
        offset: 0,
        size: DEFAULT_PAGE_SISE,
      }
    }
  }
  public handleTableOperational = async (item) => {
    console.dir(item)
    const { operate, id, name, code } = item
    if (operate === "edit") {
      onNavigate({
        type: "PUSH",
        route: '/data_designer/edit_struct',
        params: { id, title: '编辑表' }
      });
    } else if (operate === "delete") {
      this.deleteTableSingleLine(id)
    } else if (operate === "copy") {
      this.setCopyData({ id, name, code })
      this.handleShowCopyModal()
    }
  }
  public setCopyData = (data) => {
    this.setState({
      copyData: data
    })
  }
  public deleteTableSingleLine = async (id: string) => {
    const res = await deleteTableService(id)
    if (res.code === "00000") {
      this.openNotification("success", "删除成功")
    } else {
      this.openNotification("success", "删除成功")
    }
  }
  public openNotification = (type: IStatus, msg: string = "", description: string = "") => {
    notification[type]({
      message: msg,
      description: description
    });
  }
  public handleColumnsStateChange = (props) => {

  }
  public getData = async (params, sorter, filter) => {
    const { current, pageSize } = params;
    const tableParmas = { ...params, offset: (current - 1) * pageSize || 0, size: pageSize || 10 }
    const res = await queryTableListService(tableParmas)
    const { data, total } = res.result;
    return Promise.resolve({
      data: data || [],
      success: true,
      total: total || 0
    })
  }
  public handlePaginationChange = () => {

  }
  public handleShowModal = () => {
    this.setState({
      visibleModal: true
    })
  }

  public handleTableModalClose = () => {
    this.setState({
      visibleModal: false
    })
  }

  public handleCratetTableOk = () => {
    this.handleTableModalClose();
    this.proTabRef?.reload();
  }

  public handleShowCopyModal = () => {
    this.setState({
      visibleCopyModal: true
    })
  }

  public handleCopyModalClose = () => {
    this.setState({
      visibleCopyModal: false,
    })
  }

  public handleCopyTableOk = () => {
    this.setState({
      visibleCopyModal: false,
    })
    this.proTabRef?.reload();
  }
  public render() {
    const { visibleModal, visibleCopyModal, copyData } = this.state;
    return (
      <Row className="data-design-layout">
        <Col xs={24} sm={8} md={7} lg={7} xl={5} className="sider-menu-tree">
          <MeunsTree />
        </Col>
        <Col xs={24} sm={16} md={17} lg={17} xl={19} className="content-pro-table">
          <ProTable
            request={this.getData}
            search={{
              searchText: "搜索",
              resetText: "清空",
              collapsed: false,
              collapseRender: () => ""
            }}
            actionRef={(ref) => this.proTabRef = ref}
            columns={this.columns}
            onColumnsStateChange={this.handleColumnsStateChange}
            rowKey="id"
            scroll={{ x: '500px' }}
            toolBarRender={() => [
              <Button key="3" type="primary" onClick={this.handleShowModal}>
                新建表
            </Button>,
            ]}
            pagination={{
              hideOnSinglePage: true,
            }}
          />
        </Col>
        <CreateModal
          title="新建数据表"
          modalVisible={visibleModal}
          onCancel={this.handleTableModalClose}
        >
          <CreateTable
            onOk={this.handleCratetTableOk}
            onCancel={this.handleTableModalClose}
          />
        </CreateModal>
        <CreateModal
          title="复制数据表"
          modalVisible={visibleCopyModal}
          onCancel={this.handleCopyModalClose}
        >
          <CopyTable
            data={copyData}
            onOk={this.handleCopyTableOk}
            onCancel={this.handleCopyModalClose}
          />
        </CreateModal>
      </Row>)
  }

}
export default DataDesign;
