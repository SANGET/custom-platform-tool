import React, {
  FC, useState, useEffect, useCallback
} from 'react';
import {
  Row, Col, Input, Modal, Form, Button, Table, Popconfirm, Space
} from 'antd';

/** 网络请求工具 */
import Http from '@infra/utils/http';

/** 基本表单 */
import BasicForm from '@provider-app/data-designer/src/components/BasicForm';
import { renderIndexCol, renderOperCol } from '@provider-app/data-designer/src/bizComps/EditableTable';
/**
* 表头菜单组件
*/
import TableHeadMenu from '@provider-app/data-designer/src/bizComps/TableHeadMenu';

import { getModalConfig } from '../../tools/mix';
import DictForm from './DictForm';

const DictManage = () => {
  const [pager, setPager] = useState({ page: 1, pageSize: 10 });

  /**
  * 弹窗表单标题
  */
  const [formTitle, setFormTitle] = useState('');
  /**
  * 字典表单显示隐藏控制
  */
  const [visible, setVisiable] = useState(false);
  /** 操作按钮 */
  const operButs = [
    {
      text: '编辑',
      onClick: (row) => {
        setFormTitle('编辑字典');
        setVisiable(true);
      }
    },
    { text: '删除', title: '你确定删除这条字典?', onClick: (row) => { } },
  ];
  const columns = [
    // renderIndexCol(pager),
    {
      title: '字典名称',
      dataIndex: 'name',
      width: 140,
    },
    {
      title: '字典描述',
      dataIndex: 'remark',
      width: '30%',
    },
    {
      title: '最后修改人',
      dataIndex: 'remark',
      width: 140,
    },
    {
      title: '最后修改时间',
      dataIndex: 'remark',
      width: 160,
    },
    renderOperCol(operButs),

  ];

  const data = [
    {
      key: 1,
      name: 'John Brown sr.',
      age: 60,
      address: 'New York No. 1 Lake Park',
      children: [
        {
          key: 11,
          name: 'John Brown',
          age: 42,
          address: 'New York No. 2 Lake Park',
        },
        {
          key: 12,
          name: 'John Brown jr.',
          age: 30,
          address: 'New York No. 3 Lake Park',
          children: [
            {
              key: 121,
              name: 'Jimmy Brown',
              age: 16,
              address: 'New York No. 3 Lake Park',
            },
          ],
        },
        {
          key: 13,
          name: 'Jim Green sr.',
          age: 72,
          address: 'London No. 1 Lake Park',
          children: [
            {
              key: 131,
              name: 'Jim Green',
              age: 42,
              address: 'London No. 2 Lake Park',
              children: [
                {
                  key: 1311,
                  name: 'Jim Green jr.',
                  age: 25,
                  address: 'London No. 3 Lake Park',
                },
                {
                  key: 1312,
                  name: 'Jimmy Green sr.',
                  age: 18,
                  address: 'London No. 4 Lake Park',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      key: 2,
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
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
      { text: '导入', onClick: () => {} },
      { text: '导出', onClick: () => {} },
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

  /**
  * 搜索表单实例
  */
  const [searchForm] = Form.useForm();
  /** 搜索条件-表名称 */
  const searchProps = {
    form: searchForm,
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
                  // queryList({ description, name, offset: 0 });
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

export default DictManage;
