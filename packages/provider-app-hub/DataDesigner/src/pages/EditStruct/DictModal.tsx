import React, {
  FC, useState, useEffect, useCallback
} from 'react';
import {
  Row, Col, Input, Modal, Form, Button, Table, Popconfirm, Space
} from 'antd';

import styled from 'styled-components';
/** 网络请求工具 */
import Http from '@infra/utils/http';
import { BasicSearchForm } from '@provider-app/data-designer/src/bizComps/SearchForm';
import { renderIndexCol, renderOperCol } from '@provider-app/data-designer/src/bizComps/EditableTable';
/**
* 表头菜单组件
*/
import TableHeadMenu from '@provider-app/data-designer/src/bizComps/TableHeadMenu';

import DictForm from '@provider-app/data-designer/src/pages/DictManage/DictForm';
import { getModalConfig } from '../../tools/mix';

const DictModal = () => {
  const [pager, setPager] = useState({ page: 1, pageSize: 10 });

  /**
  * 弹窗表单标题
  */
  const [formTitle, setFormTitle] = useState('');
  /**
  * 字典表单显示隐藏控制
  */
  const [visible, setVisiable] = useState(false);

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

  const data = [
    {
      key: 1,
      name: 'John Brown sr.',
      description: 'Sidney No. 1 Lake Park',
    },
    {
      key: 2,
      name: 'Joe Black',
      description: 'Sidney No. 1 Lake Park',
    },
  ];
  /**
  * 提交数据
  * type-
  */
  const submitData = ({ type, args }) => {
    const reqMethod = {
      add: 'post',
      update: 'put'
    }[type];
    /**
  * 新增字段参数
  */
    const params = {
      name: "性别",
      description: "性别,男1女0",
      items: [
        {
          code: "0",
          name: "女",
          renderColor: "#fff"
        },
        {
          code: "1",
          name: "男",
          renderColor: "#fff"
        }
      ]
    };
    Http[reqMethod](' http://{ip}:{port}/paas/ {lesseeCode}/{applicationCode}/data/v1/dictionary/', { data: params }).then((res) => {
      console.log(res);
    });
  };
  /**
  * 查询字典列表
  */
  const getList = (params) => {
    Http.get('http://{ip}:{port}/paas/ {lesseeCode}/{applicationCode}/data/v1/dictionary/list', { params }).then((res) => {
      console.log(res);
    });
  };
  /**
  * 查询字典详情
  */
  const getDetail = (id) => {
    Http.get("http://{ip}:{port}/paas/ {lesseeCode}/{applicationCode}/data/v1/dictionary/{id}", { params: { id } }).then((res) => {
      console.log(res);
    });
  };
  /**
  * 删除字典
  */
  const delDict = () => {
    Http.delete("http://{ip}:{port}/paas/ {lesseeCode}/{applicationCode}/data/v1/tables/{id}", { params: { id } }).then((res) => {
      console.log(res);
    });
  };
  /**
  * 新增/修改子字典接口
  */
  const modifySubDict = (data) => {
    /**
    * {
    "dictionaryId":1292652624910360576, // 列表第一行的id
    "pid":1291934535084285952,
    "items":[
        {
            "code":"3",
            "name":"女孩",
            "renderColor":"#fff"
        },
        {
            "code":"4",
            "name":"女人",
            "renderColor":"#fff"
        }
    ]
}
    */
    Http.put("http://{ip}:{port}/paas/ {lesseeCode}/{applicationCode}/data/v1/dictionary_value/", { data }).then((res) => {
      console.log(res);
    });
  };
  /**
  * 查询字典项项
  */
  const getSubDictDetail = (params) => {
    // {
    //   dictionaryId
    //   pid
    // }
    Http.get('http://{ip}:{port}/paas/ {lesseeCode}/{applicationCode}/data/v1/dictionary_value/{dictionaryId}/{pid}', { params }).then((res) => {
      console.log(res);
    });
  };
  /**
  *
  * 删除子字典项
  */
  const delSubDetail = (params) => {
    /**
    * 是删除子字典下面的子项,不是删除子字典自身
    */
    // dictionaryId
    // pid
    /**
    * "level"=5时 第5级隐藏配置子项,删除子项按钮
    */
    Http.delete('http://{ip}:{port}/paas/ {lesseeCode}/{applicationCode}/data/v1/dictionary_value/{dictionaryId}/{pid}', { params }).then((res) => {
      console.log(res);
    });
  };

  const formItemLayout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 14 },
  };
  const [form] = Form.useForm();

  /**
  * 表格头部按钮菜单属性配置
  */
  const tableHeadMenus = {
    title: '字典列表',
    style: { marginTop: "20px" },
    menus: [
      {
        text: '新建',
        onClick: () => {
          setFormTitle('新增字典');
          setVisiable(true);
        }
      },
    ]
  };
  /**
  * 字典表单弹窗配置
  */
  const modalProps = getModalConfig({
    visible,
    title: formTitle,
    /**
     * 弹框确定按钮回调
     * @param e  点击按钮事件源
     * @param { fieldForm-新建表可控表单实例 }
     */
    onOk: (e) => {
      setVisiable(false);
    },
    /** 弹框取消按钮回调 */
    onCancel: (e) => {
      setVisiable(false);
    },
  });

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };
  const searchProps = {
    colSpan: 10,
    btnSpan: 4,
  };

  return (<>
    <BasicSearchForm {...searchProps} />
    <TableHeadMenu {...tableHeadMenus} />
    <Table
      bordered
      rowSelection={{
        type: 'radio',
        ...rowSelection,
      }}
      columns={columns.map((item) => {
        item.key = item.dataIndex;
        return item;
      })}
      dataSource={data}
      pagination={{
        showTotal: ((total) => {
          return `共 ${total} 条`;
        }),
        onChange: (page, pageSize) => {
          setPager({ page, pageSize });
        }
      }}
    />
    <Modal {...modalProps}>
      <DictForm form={form}/>
    </Modal>

  </>);
};

export default DictModal;
