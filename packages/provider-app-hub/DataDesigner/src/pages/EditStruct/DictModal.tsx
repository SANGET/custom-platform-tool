import React, { useState, useEffect } from 'react';
import { Modal, Form, Table } from 'antd';

import styled from 'styled-components';
/** 网络请求工具 */
import Http, { Msg } from '@infra/utils/http';

/** 基本表单 */
import BasicForm from '@provider-app/data-designer/src/components/BasicForm';
import { renderIndexCol } from '@provider-app/data-designer/src/components/BasicEditTable';
/**
* 表头菜单组件
*/
import TableHeadMenu from '@provider-app/data-designer/src/bizComps/TableHeadMenu';

import DictForm from '@provider-app/data-designer/src/pages/DictManage/DictForm';
import { Connector } from '@provider-app/data-designer/src/connector';
import { getModalConfig } from '../../tools/mix';

const DictModal = ({ onChange, ...rest }) => {
  const [pager, setPager] = useState({ page: 1, pageSize: 10 });

  const columns = [
    renderIndexCol(pager),
    {
      title: '字典名称',
      dataIndex: 'name',
    },
    {
      title: '字典描述',
      dataIndex: 'description',
    },

  ];
  /** 列表加载动画 */
  const [tableLoading, setTableLoading] = useState(false);
  /** 列表数据 */
  const [tableData, setTableData] = useState([]);

  const [form] = Form.useForm();

  /**
  * 查询字典列表
  */
  const getList = (args = {}) => {
    const params = Object.assign({}, {
      name: '', description: "", offset: 0, size: 10,
    }, args);
    setTableLoading(true);
    Http.get('/smart_building/data/v1/dictionary/list', { params }).then((res) => {
    // console.log(res.data.result);
      setTableData(res.data.result.data);
    }).finally(() => {
      setTableLoading(false);
    });
  };
  /** 页面加载结束发请求 */
  useEffect(() => {
    getList();
  }, []);

  /**
  * 字典新增弹窗显隐,表单标题控制
  */
  const [modalConfig, setModalConfig] = useState({
    visible: false, title: '', isSub: false, isAddEditRow: false
  });
  /**
  * 表格头部按钮菜单属性配置
  */
  const tableHeadMenus = {
    title: '字典列表',
    style: { marginTop: "20px" },
    menus: [
      {
        text: '新增',
        onClick: () => {
          setModalConfig({
            title: '新增字典', visible: true, isSub: false, isAddEditRow: true
          });
        }
      },
    ]
  };

  /**
  * 清除表单校验错误提示,关闭弹窗
  */
  const handleModalClose = () => {
    form.resetFields();
    setModalConfig({
      visible: false, title: '', isSub: false, isAddEditRow: false
    });
  };
  /**
  * 字典表单弹窗配置
  */
  const modalProps = getModalConfig({
    visible: modalConfig.visible,
    title: modalConfig.title,
    isSub: modalConfig.isSub,
    isAddEditRow: modalConfig.isAddEditRow,
    width: "1000px",
    /**
   * 弹框确定按钮回调
   * @param e  点击按钮事件源
   * @param { fieldForm-新建表可控表单实例 }
   */
    onOk: (e) => {
      form.validateFields().then((values) => {
        console.log(values);

        submitData({
          type: modalConfig.title === '新增字典' ? 'add' : 'update',
          data: values,
          cb: () => {
            handleModalClose();
          }
        });
      })
        .catch((errorInfo) => {
          /** 校验未通过 */
          console.log(errorInfo);
          // Msg.error('表单校验未通过');
        });
    },
    /** 弹框取消按钮回调 */
    onCancel: (e) => {
      handleModalClose();
    },
  });

  /**
  * 提交数据
  * type-
  */
  const submitData = ({ type, data, cb }) => {
    const reqMethod = {
      add: 'post',
      update: 'put'
    }[type];

    Http[reqMethod]('/smart_building/data/v1/dictionary/', data).then((res) => {
      Msg.success('操作成功');
      getList();
      cb && cb();
      // console.log(res);
    });
  };
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // onChange(selectedRowKeys[0]);
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };

  /**
  * 搜索表单实例
  */
  const [searchForm] = Form.useForm();
  /** 搜索条件-表名称 */
  const searchProps = {
    form: searchForm,
    colSpan: 9,
    btnSpan: 6,
    items: {
      name: {
        itemAttr: {
          label: "字典名称",
        },
        compAttr: {
          type: 'Input',
          placeholder: "请输入字典名称",
        }
      },
      description: {
        /** 表单项属性 */
        itemAttr: {
          label: "字典描述",
        },
        /** 表单项包裹组件属性 */
        compAttr: {
          type: 'Input',
          placeholder: '请输入表名称',
        }
      },
      btns: {
        itemAttr: {},
        compAttr: [
          {
            type: 'primary',
            text: '搜索',
            onClick: () => {
              searchForm
                .validateFields() /** 表单校验 */
                .then((values) => {
                  const { description, name } = values;
                  /**
                    * 列表查询,页码从0开始
                    */
                  getList({ description, name, offset: 0 });
                });
            }
          },
          {
            type: '',
            text: '清空',
            onClick: () => {
              searchForm.resetFields();
            }
          }
        ]
      }
    }

  };

  return (<>
    <BasicForm {...searchProps} />
    <TableHeadMenu {...tableHeadMenus} />
    <Table
      bordered
      loading={tableLoading}
      rowSelection={{
        type: 'radio',
        ...rowSelection,
      }}
      rowKey={(record) => record.id}
      columns={columns.map((item) => {
        // item.key = item.dataIndex;
        return item;
      })}
      dataSource={tableData}
      pagination={{
        showTotal: ((total) => {
          return `共 ${total} 条`;
        }),
        onChange: (page, pageSize = 10) => {
          setPager({ page, pageSize });
          getList({ offset: page - 1, size: pageSize });
        }
      }}
    />
    <Modal {...modalProps} key={new Date().getTime()} >
      <DictForm form={form} isSub={modalProps.isSub} isAddEditRow={modalProps.isAddEditRow} />
    </Modal>

  </>);
};
export default Connector(DictModal);
