/*
 * @Author: wangph
 * @Date: 2020-07-10 12:00:29
 * @Last Modified by:   wangph
 * @Last Modified time: 2020-07-10 12:00:29
 */
// import { useHistory } from 'react-router-dom';
// , useContext
import React, { FC, useState, useEffect } from 'react';
import {
  Menu, Dropdown, Button, Input, Modal, Form, Space, Tooltip, Popconfirm
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
/** 可复用组件 */
// import Http from '@infra/utils/http';
import Http from '@infra/utils/http';
import { useMappedState } from 'redux-react-hook';
import BasicTree from '@data-design/components/BasicTree';
import BasicTreeTransfer from '@data-design/components/BasicTreeTransfer';
import { BasicSelect } from '@data-design/components/BasicSelect';
import { TableTypeEnum } from '@data-design/tools/constant';

/** 业务组件 */
import TableStructForm from '@data-design/bizComps/TableStructForm';
import StructTable from '@data-design/bizComps/StructTable';

/** 不会操作页面状态的方法 */
import {
  generateSelectedTree, treeFilter, disTreeNode, listToTree
} from '@data-design/tools/tree';

/** 模拟数据 */
import { treeData } from '@data-design/mock';

/** 应用上下文 */
// import { AppContext as Context } from '@data-design/app';
/** 当前功能页样式 */
import './tableStruct.less';

// import { IPager } from '@data-design/store';
const mapState = (state) => ({
  structPager: state.structPager,
});
const AuthItem: FC = () => {
  // const AppContext = useContext(Context);
  const { structPager } = useMappedState(mapState);
  const { page, pageSize } = structPager;
  // console.log(page, pageSize)

  /** react路由跳转 */
  // const history = useHistory();
  /** 模态框类型枚举 */
  const ModalTypeEnum = {
    custom: 'custom',
    fast: 'fast',
  };

  /**
   * 如果 state 的类型为 Number, String, Boolean 建议使用 useState，如果 state 的类型 为 Object 或 Array，建议使用 useReducer
   * 如果 state 变化非常多，也是建议使用 useReducer，集中管理 state 变化，便于维护
   * 如果 state 关联变化，建议使用 useReducer
   * 业务逻辑如果很复杂，也建议使用 useReducer
   * 如果 state 只想用在 组件内部，建议使用 useState，如果想维护全局 state 建议使用 useReducer
   *    */
  /** 搜索输入框 */
  const { Search } = Input;
  /** 更新树形组件数据源 */
  const [dataSource, setDataSource] = useState([]);
  /** 设置模块框的显示隐藏 */
  const [visible, setVisiable] = useState<boolean>(false);
  /** 区分模态框展示的内容 */
  const [modalType, setModalType] = useState<string>(ModalTypeEnum.custom);
  /** 设置模态框的宽度 */
  const [modalWidth, setModalWidth] = useState<string | number>(520);
  /** 更新选择的树节点key集合 */
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  /** 更新选中树数据源 */
  const [selectedTree, setSelectedTree] = useState([]);
  const [tableData, setTableData] = useState([]);
  /** 创建可控表单实例 */
  const [form] = Form.useForm();
  /** 不能定义在函数里面 */

  // AppContext.dispatch({
  //   type: 'show',
  //   payload: {}
  // });
  useEffect(() => {
    Http.get('http://localhost:60001/mock/structList.json', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        // console.log(res.data.result.data)
        /** 列表数据--每行记录必需有key字段 */
        setTableData(res.data.result.data.map((col) => {
          col.key = col.id;
          return col;
        }));
      })
      .catch((err) => console.log(err));

    Http.get('http://localhost:60001/mock/menu.json', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log(listToTree(res.data.result));
        setDataSource(listToTree(res.data.result));
      })
      .catch((err) => console.log(err));
  }, []);

  /**
   * 穿梭框移动节点之后触发回调
   * @param targetKeys  选中节点key的集合
   */
  const onChange = (targetKeys) => {
    // console.log('Target Keys:', targetKeys);
    setTargetKeys(targetKeys);
    /** 禁用已选择的节点 */
    setDataSource(disTreeNode(dataSource, targetKeys));
    /** 根据选中的节点的key生成选中节点树 */
    setSelectedTree(generateSelectedTree(treeData, targetKeys));
    // console.log(generateSelectedTree(treeData, targetKeys));
  };
  /**
   * 过滤掉已选择的树节点
   */
  const filter = (dataSource) => {
    /** 过滤掉选中的节点 */
    const reserveTree = treeFilter({
      treeData: dataSource,
      filter: (node) => !node.disabled,
    });
    // console.log(reserveTree);
    setDataSource(reserveTree);
  };

  /**
   * 弹框确定按钮回调
   * @param e  点击按钮事件源
   * @param { modalType-弹窗类型, treeData-源树, selectedTree-选中树 }
   */
  const handleOk = (e, {
    modalType, treeData, selectedTree, form
  }) => {
    /** 快速创建权限项 */
    if (modalType === ModalTypeEnum.fast) {
      console.log({ treeData, selectedTree });
      setVisiable(false);
    } else if (modalType === ModalTypeEnum.custom) {
      /**
       * 自定义权限项
       * 表单校验
       */
      form
        .validateFields()
        .then((values) => {
          console.log(values);
          setVisiable(false);
        })
        .catch((errorInfo) => {
          /** 校验未通过 */
          console.log(errorInfo);
        });
    }
  };
  /** 弹框取消按钮回调 */
  const handleCancel = (e) => {
    setVisiable(false);
  };

  const TableHeadMenu = () => {
    /** 更多按钮菜单 */
    const moreButs = [
      { key: 'tpl', menu: '表结构模板' },
      { key: 'import', menu: '导入表结构' },
      { key: 'export', menu: '导出表结构' },
      { key: 'dict', menu: '字典管理' },
    ];

    /**
     * 创建权限项下拉按钮菜单点击触发回调
     * 执行模态框内容切换
     * @param e 点击选项事件源
     */
    const dropdownClick = (e) => {
      const { key } = e;
      const keyAction = {
        tpl: () => {

        },
        import: () => {

        },
        export: () => { },
        dict: () => { }
      };

      keyAction[key] && keyAction[key]();
      // console.log(e);
      // setModalType(key)
      // switch (key) {
      //   case ModalTypeEnum.custom: {
      //     setModalWidth(520)
      //     setVisiable(true)
      //     break
      //   }
      //   case ModalTypeEnum.fast: {
      //     setModalWidth('60%')
      //     setVisiable(true)
      //     break
      //   }
      // }
    };
    console.log();
    const openModal = () => {
      setModalWidth(520);
      setVisiable(true);
    };

    /** 下拉框选项 */
    const menu = (
      <Menu onClick={dropdownClick}>
        {

          moreButs.map((item) => (<Menu.Item key={item.key}>{item.menu}</Menu.Item>))
        }

      </Menu>
    );
    return (
      <section className="table-head-menu">
        <div className="ant-table-title">数据表列表</div>
        <div>
          <Button type="primary" className="button" style={{ marginRight: '16px' }} onClick={() => openModal()}>
            新建表
          </Button>
          <Button type="primary" className="button" style={{ marginRight: '16px' }}>
            标签管理
          </Button>
          <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
            <Button type="primary" className="button" style={{ marginRight: '16px' }}>
              更多按钮 <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </section>
    );
  };
  /** 树组件属性 */
  const treeProps = {
    dataSource,
    selectedTree,
    targetKeys,
    disTreeNode,
    onChange,
  };
  /** 模态框属性 */
  const modalProps = {
    visible,
    title: '新建数据表',
    onOk: (e) => handleOk(e, {
      modalType,
      treeData,
      selectedTree,
      form,
    }),
    onCancel: handleCancel,
    okText: '确定',
    cancelText: '取消',
    width: modalWidth,
  };

  const btnProps = {
    // type: 'primary',
    style: { marginTop: '10px' },
    onClick: () => {
      filter(dataSource);
    },
  };
  const searchProps = {
    style: { width: '300px', margin: '20px' },
    placeholder: '请输入权限项名称或编码',
    onSearch: (value) => {
      // history.push('/home');
      // console.log(value);
    },
    enterButton: true,
  };

  const formProps = {
    form,
    treeData: dataSource,
    initialValues: { authName: 'Hi, man!' },
  };

  const basicTreeProps = {
    draggable: true,
    blockNode: true,
    dataSource,
  };

  /** 单元格属性集合 */
  const columns = (() => {
    /** 行删除按钮触发回调 */
    // const onDel = (row) => {
    //   console.log(`删除行=${row}`);
    // };
    const operButs = [
      { text: '编辑', onClick: (row) => { } },
      { text: '删除', onClick: (row) => { } },
      { text: '复制', onClick: (row) => { } },
      { text: '表关系图', onClick: (row) => { } },
    ];

    const cols = [
      {
        title: '序号',
        dataIndex: 'rowIndex',
        width: 80,
        /** 复杂情况渲染函数 */
        render: (text, record, index) => {
          // console.log({ text, record, index });
          /** 与后端协商,行号由前端计算 */
          return <span>{(page - 1) * pageSize + index + 1}</span>;
        },
      },
      {
        title: '数据表名称',
        dataIndex: 'name',
        formItemType: 'text',
        editable: true,
        width: 200,
      },
      {
        title: '数据表编码',
        dataIndex: 'code',
        formItemType: 'text',
        editable: true,
        width: 200,
      },
      {
        title: '表类型',
        dataIndex: 'type',
        formItemType: 'select',
        editable: true,
        required: false,
        width: 400,
        render: (val) => {
          /** 将选项代码转换为文字 */
          const showText = TableTypeEnum.find((item) => item.value === val);
          return showText ? showText.text : '';
        },
      },
      {
        //       module_id	String|归属模块
        // module_name	String	归属模块名称
        // species	String	业务字段类型，SYS(系统元数据)BIS(业务元数据)，用户填写的表默认BIS即可
        // description	String	备注
        // aux_table	AuxTableVO	附属表对象,如果表类型是附属表，则必填
        // tree_table	TreeTableVO	树型表对象,如果表类型是树型表，则必填

        title: '归属模块',
        dataIndex: 'module_id',
        formItemType: 'tree-select',
        editable: true,
        width: 200,
        // render: (key) => {
        //   if (!key) return ''
        //   /** 根据节点的key查找节点 */
        //   return treeQuery(treeData, key).title
        // },
      },
      {
        title: '创建时间',
        dataIndex: 'gmt_create',
        width: 200,
      },
      // {
      //   title: '版本',
      //   dataIndex: 'createType',
      //   width: 200
      // },
      // {
      //   title: '标签',
      //   dataIndex: 'createType',
      //   width: 200
      // },
      {
        title: '最后修改时间',
        dataIndex: 'gmt_modified',
        width: 160,
      },
      {
        title: '最后修改人员',
        dataIndex: 'modified_by',
        width: 200,
      },
      {
        title: '操作',
        dataIndex: 'operCol',
        fixed: 'right',
        width: operButs.length * 80,
        render: (row) => {
          return operButs.map((item) => {
            return (

              <Space size="middle" key={item.text}>
                {
                  item.text === '删除'

                    ? (<Popconfirm placement="topLeft" title={'你确定要删除这条记录吗?'} onConfirm={item.onClick(row)} okText="删除" cancelText="取消">
                      <Button type="link" >
                        {item.text}
                      </Button>
                    </Popconfirm>)

                    : (<Button type="link" onClick={() => item.onClick(row)}>
                      {item.text}
                    </Button>)
                }
              </Space>
            );
          });
        },
      },
    ];
    return cols.map((col) => {
      return {
        ellipsis: {
          showTitle: false,
        },
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
        ...col,
        key: col.dataIndex
      };
    });
  })();
  const authTableProps = {
    treeData,
    tableData,
    columns,
    scroll: {
      x: 200,
      y: 800,
    },
    style: {
      width: 'calc(100% - 40px)',
      margin: '0 20px',
    },
  };

  return (
    <div className="auth-item flex b1px " style={{ height: '100%' }}>
      <aside className="tree-box">
        <BasicTree {...basicTreeProps} />
      </aside>
      <main className="content bl1px">
        <div className="flex v-center ml20">
          <BasicSelect enum={TableTypeEnum} />
          <Search {...searchProps} />
        </div>
        <TableHeadMenu />
        <StructTable {...authTableProps} />
        {/* <Table dataSource={tableData} columns={columns} />; */}
      </main>
      <Modal {...modalProps}>
        {modalType === ModalTypeEnum.fast ? (
          <div>
            <BasicTreeTransfer {...treeProps} />
            <Button {...btnProps}>一键过滤</Button>
          </div>
        ) : (
          <TableStructForm {...formProps} />
        )}
      </Modal>
    </div>
  );
};

export default AuthItem;
