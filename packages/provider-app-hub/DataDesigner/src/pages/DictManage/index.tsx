import React, {
  FC, useState, useEffect, useCallback
} from 'react';
import {
  Row, Col, Input, Modal, Form, Button, Table, Popconfirm, Space
} from 'antd';

/** 网络请求工具 */
import Http, { Msg } from '@infra/utils/http';

/** 基本表单 */
import BasicForm from '@provider-app/data-designer/src/components/BasicForm';
import { renderIndexCol, renderOperCol, getColConfig } from '@provider-app/data-designer/src/components/BasicEditTable';
/**
* 表头菜单组件
*/
import TableHeadMenu from '@provider-app/data-designer/src/bizComps/TableHeadMenu';

import { Connector } from '@provider-app/data-designer/src/connector';

import { getModalConfig } from '@provider-app/data-designer/src/tools/mix';
import { formatGMT } from '@provider-app/data-designer/src/tools/format';
import DictForm from '@provider-app/data-designer/src/pages/DictManage/DictForm';

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
  /**
  * 删除字典
  */
  const DelDict = (id) => {
    Http.delete(`/smart_building/data/v1/tables/${id}`).then((res) => {
      Msg.success('操作成功');
      // console.log(res);
      getList();
    });
  };
  /** 操作按钮 */
  const operButs = [
    {
      text: '编辑',
      onClick: (row) => {
        /**
        * 获取详情
        */
        getDetail({
          id: row.id,
          cb: (data) => {
            getSubDictDetail({
              dictionaryId: data.id,
              pid: data.items[0].id,
            });
            // data.name = 'test';
            // submitData({ type: 'update', data });
            // modifySubDict({
            //   dictionaryId: data.id,
            //   pid: data.items[0].id,
            //   items: [{
            //     code: "zzdxz",
            //     name: "子字典新增",
            //     renderBgColor: "#000",
            //     renderFontColor: "#fff"
            //   }]
            // });
            // delSubDetail({
            //   dictionaryId: data.id,
            //   pid: data.items[0].id,
            //   cb: () => Msg.success('操作成功')
            // });
          }
        });
        // setFormTitle('编辑字典');
        // setVisiable(true);
      }
    },
    {
      text: '删除',
      title: '你确定删除这条字典?',
      onClick: (row) => {
        DelDict(row.id);
      }
    },
  ];

  //   createdBy: null
  // createdUserName: null
  // description: "性别,男1女0"
  // gmtCreate: "2020-08-20T17:01:14.802"
  // gmtModified: "2020-08-20T17:01:14.802"
  // id: "1296371706025353216"
  // items: null
  // modifiedBy: null
  // modifiedUserName: null
  // name: "性别"
  const [tableData, setTableData] = useState([]);
  const columns = [
    // renderIndexCol(pager),
    {
      title: '字典名称',
      dataIndex: 'name',
      width: 140,
    },
    {
      title: '字典描述',
      dataIndex: 'description',
      width: '30%',
    },
    {
      title: '最后修改人',
      dataIndex: 'modifiedUserName',
      width: 140,
    },
    {
      title: '最后修改时间',
      dataIndex: 'gmtModified',
      width: 160,
    },
    renderOperCol(operButs),

  ];

  /**
  * 提交数据
  * type-
  */
  const submitData = ({ type, data }) => {
    const reqMethod = {
      add: 'post',
      update: 'put'
    }[type];

    Http[reqMethod]('/smart_building/data/v1/dictionary/', data).then((res) => {
      Msg.success('操作成功');
      getList();
      // console.log(res);
    });
  };

  /**
  * 查询字典列表
  */
  const getList = (args = {}) => {
    const params = Object.assign({}, {
      name: '', description: "", offset: 0, size: 10,
    }, args);
    Http.get('/smart_building/data/v1/dictionary/list', { params }).then((res) => {
      // console.log(res.data.result);
      const data = res.data.result.data.map((row) => ({
        ...row,
        gmtModified: formatGMT(row.gmtModified)

      }));

      setTableData(data);
    });
  };

  useEffect(() => {
    getList();
  }, []);

  /**
  * 查询字典详情
  */
  const getDetail = ({ id, cb }) => {
    Http.get(`/smart_building/data/v1/dictionary/${id}`, {}).then((res) => {
      cb && cb(res.data.result);
    });
  };

  /**
  * 新增/修改子字典接口
  */
  const modifySubDict = (data) => {
    // const reqMethod = {
    //   add: 'post',
    //   update: 'put'
    // }[type];
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
    Http.put("/smart_building/data/v1/dictionary_value/", data).then((res) => {
      // console.log(res);
      getList();
      Msg.success('操作成功');
    });
  };
  /**
  * 查询字典项项
  */
  const getSubDictDetail = (args) => {
    const { dictionaryId, pid, cb } = args;

    Http.get(`/smart_building/data/v1/dictionary_value/${dictionaryId}/${pid}`).then((res) => {
      console.log(res);
      cb && cb(res);
    });
  };
  /**
  *
  * 删除子字典项
  */
  const delSubDetail = (params) => {
    const { dictionaryId, pid, cb } = params;

    /**
    * 是删除子字典下面的子项,不是删除子字典自身
    */
    // dictionaryId
    // pid
    /**
    * "level"=5时 第5级隐藏配置子项,删除子项按钮
    */
    Http.delete(`/smart_building/data/v1/dictionary_value/${dictionaryId}/${pid}`).then((res) => {
      cb && cb(res);
      // console.log(res);
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
          // submitData({
          //   type: 'add',
          //   data: {
          //     name: `性别-${new Date().getTime()}`,
          //     description: "性别,男1女0",
          //     items: [
          //       {
          //         code: "0",
          //         name: "女",
          //         renderBgColor: "#fff",
          //         renderFontColor: "#fff"
          //       },
          //       {
          //         code: "1",
          //         name: "男",
          //         renderBgColor: "#fff",
          //         renderFontColor: "#fff"
          //       }
          //     ]
          //   }
          // });

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

  const cols = columns.map((item) => getColConfig(item));

  return (<>
    <BasicForm {...searchProps} />
    <TableHeadMenu {...tableHeadMenus} />
    <Table
      bordered
      columns={cols}
      dataSource={tableData}
      rowKey={(record) => record.id}
      pagination={{
        showTotal: ((total) => {
          return `共 ${total} 条`;
        }),
        onChange: (page, pageSize) => {
          getList({ offset: page - 1, size: pageSize });
          setPager({ page, pageSize });
        }
      }}
    />
    <Modal {...modalProps}>
      <DictForm form={form}/>
    </Modal>

  </>);
};

const DictManageContainer = Connector(DictManage);
export default DictManageContainer;
