/*
 * @Author: wangph
 * @Date: 2020-07-10 12:00:29
 * @Last Modified by:   wangph
 * @Last Modified time: 2020-07-10 12:00:29
 */
import { useHistory } from 'react-router-dom';
import React, {
  FC, useState, useEffect, useContext
} from 'react';
import {
  Menu, Dropdown, Button, Input, Modal, Form, Space, Tooltip
} from 'antd';
/** 可复用组件 */
// import Http from '@infra/utils/http';
import Http, { CancelToken } from '@infra/utils/http';
import BasicTree from '../../common/components/BasicTree';
import BasicTreeTransfer from '../../common/components/BasicTreeTransfer';

/** 业务组件 */
import AuthForm from '../../common/bizComps/AuthForm';
import AuthTable from '../../common/bizComps/AuthTable';

/** 不会操作页面状态的方法 */
import {
  generateSelectedTree, treeFilter, disTreeNode, treeQuery
} from '../../common/tools/tree';

/** 模拟数据 */
import { treeData, tableData } from '../../mock';

/** 应用上下文 */
import { AppContext as Context } from '../../app';
/** 当前功能页样式 */
import './authItem.less';

const AuthItem: FC = () => {
  const AppContext = useContext(Context);
  /** react路由跳转 */
  const history = useHistory();
  /** 模态框类型枚举 */
  const ModalTypeEnum = {
    custom: 'custom',
    fast: 'fast'
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
  const [dataSource, setDataSource] = useState(treeData);
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
  /** 创建可控表单实例 */
  const [form] = Form.useForm();
  /** 不能定义在函数里面 */

  useEffect(() => {
    // Http.get('http://jsonplaceholder.typicode.com/users/1')
    //   .then((res) => console.log(res.data.name))
    //   .catch((err) => console.log(err));
    let cancelAjax;
    Http.request({
      url: '/test',
      method: 'post',
      data: {
        auth: 'tree'
      },
      /** cancelToken 指定用于取消请求的 cancel token */
      cancelToken: new CancelToken((c) => {
        /** 获取取消请求的回调 */
        cancelAjax = c;
      }),
      headers: {
        isLoading: true,
        'Content-Type': 'application/json'
      }
    }).then((data) => {
      console.log(data);
    });
    /** 取消请求 */
    cancelAjax();
  });

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
      filter: (node) => !node.disabled
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
    /**
     * 创建权限项下拉按钮菜单点击触发回调
     * 执行模态框内容切换
     * @param e 点击选项事件源
     */
    const dropdownClick = (e) => {
      const { key } = e;
      // console.log(e);
      setModalType(key);
      switch (key) {
        case ModalTypeEnum.custom: {
          setModalWidth(520);
          setVisiable(true);
          break;
        }
        case ModalTypeEnum.fast: {
          setModalWidth('60%');
          setVisiable(true);
          break;
        }
      }
    };

    /** 下拉框选项 */
    const menu = (
      <Menu onClick={dropdownClick}>
        <Menu.Item key={ModalTypeEnum.fast}>快速创建权限项</Menu.Item>
        <Menu.Item key={ModalTypeEnum.custom}>自定义创建权限项</Menu.Item>
      </Menu>
    );
    return (
      <section className="table-head-menu">
        <div className="ant-table-title">权限项列表</div>
        <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
          <Button type="primary" className="button" style={{ marginRight: '16px' }}>
            创建权限项
          </Button>
        </Dropdown>
      </section>
    );
  };

  const treeProps = {
    dataSource,
    selectedTree,
    targetKeys,
    disTreeNode,
    onChange
  };

  const modalProps = {
    visible,
    title: '创建权限项',
    onOk: (e) => handleOk(e, {
      modalType,
      treeData,
      selectedTree,
      form
    }),
    onCancel: handleCancel,
    okText: '确定',
    cancelText: '取消',
    width: modalWidth
  };

  const btnProps = {
    // type: 'primary',
    style: { marginTop: '10px' },
    onClick: () => {
      filter(dataSource);
    }
  };
  const searchProps = {
    style: { width: '300px', margin: '20px' },
    placeholder: '请输入权限项名称或编码',
    onSearch: (value) => {
      AppContext.dispatch({
        type: 'show',
        payload: {}
      });
      setTimeout(() => {
        AppContext.dispatch({
          type: 'hide',
          payload: {}
        });
      }, 1000);
      // history.push('/home');
      // console.log(value);
    },
    enterButton: true
  };

  const formProps = {
    form,
    treeData: dataSource,
    initialValues: { authName: 'Hi, man!' }
  };

  const basicTreeProps = {
    draggable: true,
    blockNode: true,
    dataSource
  };

  /** 单元格属性集合 */
  const columns = (() => {
    /** 行删除按钮触发回调 */
    const onDel = (row) => {
      console.log(`删除行=${row}`);
    };

    const cols = [
      {
        title: '序号',
        dataIndex: 'key',
        width: 80,
        /** 复杂情况渲染函数 */
        render: (text, record, index) => {
          // console.log({ text, record, index });
          // return <span>{(page - 1) * pageSize + index + 1}</span>;
        }
      },
      {
        title: '权限项名称',
        dataIndex: 'authName',
        formItemType: 'text',
        editable: true,
        width: 200
      },
      {
        title: '权限编码',
        dataIndex: 'authCode',
        formItemType: 'text',
        editable: true,
        width: 200
      },
      {
        title: '上级',
        dataIndex: 'parentId',
        formItemType: 'TreeSelect',
        editable: true,
        required: false,
        width: 400,
        render: (key) => {
          if (!key) return '';
          /** 根据节点的key查找节点 */
          return treeQuery(treeData, key).title;
        }
      },
      {
        title: '无权限显示方式',
        dataIndex: 'displayType',
        formItemType: 'select',
        editable: true,
        width: 200,
        render: (text) => {
          /** 将选项代码转换为文字 */
          return {
            0: '隐藏',
            1: '禁用'
          }[text];
        }
      },
      {
        title: '创建方式',
        dataIndex: 'createType',
        width: 200
      },
      {
        title: '最后修改时间',
        dataIndex: 'lastModified',
        width: 160
      },
      {
        title: '创建人',
        dataIndex: 'creator',
        width: 100
      },
      {
        title: '操作',
        dataIndex: 'operCol',
        fixed: 'right',
        width: 80,
        render: (row) => (
          <Space size="middle">
            <Button type="link" onClick={() => onDel(row)}>
              删除
            </Button>
          </Space>
        )
      }
    ];
    return cols.map((col) => {
      return {
        ellipsis: {
          showTitle: false
        },
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ),
        ...col
      };
    });
  })();
  const authTableProps = {
    treeData,
    tableData,
    columns,
    scroll: {
      x: 200,
      y: 800
    },
    style: {
      width: 'calc(100% - 40px)',
      margin: '0 20px'
    }
  };

  return (
    <div className="auth-item flex b1px " style={{ height: '100%' }}>
      <aside className="tree-box">
        <BasicTree {...basicTreeProps} />
      </aside>
      <main className="content bl1px">
        <Search {...searchProps} />
        <TableHeadMenu />
        <AuthTable {...authTableProps} />
      </main>
      <Modal {...modalProps}>
        {modalType === ModalTypeEnum.fast ? (
          <div>
            <BasicTreeTransfer {...treeProps} />
            <Button {...btnProps}>一键过滤</Button>
          </div>
        ) : (
          <AuthForm {...formProps} />
        )}
      </Modal>
    </div>
  );
};

export default AuthItem;
