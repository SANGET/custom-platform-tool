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
import { GetDictList, AddDict, UpdateDict } from '@provider-app/data-designer/src/api'
/** GMT时间格式化 */
import { formatGMT } from '@provider-app/data-designer/src/tools/format';

const DictManage = () => {

  const [pager, setPager] = useState({ page: 1, pageSize: 10 });

  const [structTableData, setStructTableData] = useState([]);
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
    {
      text: '删除', title: '你确定删除这条字典?', onClick: (row) => {
        console.log(structTableData, 'structTableData', 'row', row);

      }
    },
  ];
  const columns = [
    // renderIndexCol(pager),
    {
      title: '序号',
      dataIndex: 'rowIndex',
      width: 40,
      key: 'rowIndex',
      render: (text, record, index) => {
        // console.log({ text, record, index });
        /** 与后端协商,行号由前端计算 */
        const { page, pageSize } = pager
        return <span>{(page - 1) * pageSize + index + 1}</span>;
      },
    },
    {
      title: '字典名称',
      dataIndex: 'name',
      width: 140,
      key: 'name'
    },
    {
      title: '字典描述',
      dataIndex: 'description',
      width: '30%',
      key: 'description'
    },
    {
      title: '最后修改人',
      dataIndex: 'modifiedBy',
      width: 140,
      key: 'modifiedBy'
    },
    {
      title: '最后修改时间',
      dataIndex: 'gmtModified',
      width: 160,
      key: 'gmtModified'
    },
    renderOperCol(operButs),

  ];
  const queryList = async (args = {}) => {
    /**
     * 与产品约定,左侧树查询不考虑右侧列表查询条件,右侧列表查询要带上左侧查询条件,点击了搜索按钮之后才查询
     */
    const params = Object.assign({}, {
      /**  String 否 数据表名称 */
      name: '',
      // 字典描述
      description: '',
      /**  int 是 分页查询起始位置,从0开始 */
      offset: 0,
      /**  int 是 每页查询记录数 */
      size: 10
    }, args);
    /** 请求表结构列表数据 */
    // const tableRes = await Http.get('http://localhost:60001/mock/structList.json', { params });
    //const tableRes = await Http.get('/data/v1/tables/list', { params });  // -----

    const tableRes = await GetDictList(params)
    // console.log({ tableRes });

    /** 表格数据格式转换-注意setStructTableData之后不能立刻获取最新值 */
    const tableData = tableRes.result.data.map((col) => {
      /** 根据T点的key查找节点完整信息 */
      /** 返回节点的名称 */
      // col.moduleId = treeQuery(treeData, col.moduleId).title;
      // console.log(col.moduleId);
      /** 将表类型代码转换为文字 */
      // const showText = TableTypeEnum.find((item) => item.value === col.type);
      // col.type = showText ? showText.text : '';
      /** gmt时间格式转yyyy-MM-dd hh:mm:ss */
      col.gmtCreate = formatGMT(col.gmtCreate);
      col.gmtModified = formatGMT(col.gmtModified);
      /** antd table每行记录必需有key字段 */
      col.key = col.id;
      return col;
    });
    // console.log({ structTableData });
    // setTableData(structTableData);
    setStructTableData(tableData);
  };
  useEffect(() => {
    queryList()
  }, [])
  // const data = [
  //   {
  //     key: '1',

  //     name: 'John Brown sr.',

  //     description: 'New York No. 1 Lake Park',
  //   },
  //   {
  //     key: '2',

  //     name: 'Joe Black',

  //     description: 'Sidney No. 1 Lake Park',
  //   },
  // ];
  //-----接口

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
      { text: '导入', onClick: () => { } },
      { text: '导出', onClick: () => { } },
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
    onOk: async (e) => {
      // console.log(formTitle)
      if (formTitle === "新增字典") {
        //新增字典的参数
        const params = {} //请求的参数-----name,description,items(name,code,renderBgColor,renderFontColor)
        //请求的api
        await AddDict(params)
        //把新增的字典加到原来的字典集合中 --- 重新获取

      } else {
        //修改字典的参数
        const params = {}
        //请求的api
        await UpdateDict(params)
        //把修改的字典内容合并到原来的字典上，并更新字典集合-----重新获取

      }
      setVisiable(false);
    },
    /** 弹框取消按钮回调 */
    onCancel: (e) => {
      setVisiable(false);
    },
  })

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
                  queryList({ description, name, offset: 0 });

                });
            }
          },
          {
            type: '',
            text: '清空',
            onClick: () => {
              searchForm.resetFields();
              queryList();
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
      columns={columns}
      // columns={columns.map((item) => {
      //   //item.key = item.dataIndex;     -----------
      //   return item;
      // })}
      dataSource={structTableData}
      pagination={{
        showTotal: ((total) => {
          return `共 ${total} 条`;
        }),
        onChange: (page, pageSize: any) => {
          setPager({ page, pageSize });
          queryList({ offset: page, size: pageSize });
        }
      }}
    />
    <Modal {...modalProps}>
      <DictForm form={form} />
    </Modal>

  </>);
};

export default DictManage;
