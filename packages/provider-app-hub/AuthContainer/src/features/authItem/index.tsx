/*
 * @Author: wangph
 * @Date: 2020-07-10 12:00:29
 * @Last Modified by:   wangph
 * @Last Modified time: 2020-07-10 12:00:29
 */
import React, { useState } from 'react';
import {
  Menu, Dropdown, Button, Input, Modal, Form
} from 'antd';
// 可复用组件
import BasicTree from '@provider-app/auth-manager/src/common/components/BasicTree';
import BasicTreeTransfer from '@provider-app/auth-manager/src/common/components/BasicTreeTransfer';

// 业务组件
import AuthForm from '../../common/bizComps/AuthForm';
import AuthTable from '../../common/bizComps/AuthTable';

// 模拟数据
import { treeData, tableData } from '../../mock';

// 不会改变state状态的方法
import { generateSelectedTree, treeFilter, disTreeNode } from './authItem';

// 当前功能页样式
import './authItem.less';

export default () => {
  // 模态框类型枚举
  const ModalTypeEnum = {
    custom: 'custom',
    fast: 'fast'
  };
  // 搜索输入框
  const { Search } = Input;
  // 更新树形组件数据源
  const [dataSource, setDataSource] = useState(treeData);
  // 设置模块框的显示隐藏
  const [visible, setVisiable] = useState<boolean>(true);
  // 区分模态框展示的内容
  const [modalType, setModalType] = useState<string>(ModalTypeEnum.custom);
  // 设置模态框的宽度
  const [modalWidth, setModalWidth] = useState<string|number>(520);
  // 更新选择的树节点key集合
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  // 更新选中树数据源
  const [selectedTree, setSelectedTree] = useState([]);
  // 创建可控表单实例
  const [form] = Form.useForm();

  /**
   * 穿梭框移动节点之后触发回调
   * @param targetKeys  选中节点key的集合
   */
  const onChange = (targetKeys) => {
    // console.log('Target Keys:', targetKeys);
    setTargetKeys(targetKeys);
    // 禁用已选择的节点
    setDataSource(disTreeNode(dataSource, targetKeys));
    // 根据选中的节点的key生成选中节点树
    setSelectedTree(generateSelectedTree(treeData, targetKeys));
    // console.log(generateSelectedTree(treeData, targetKeys));
  };
  /**
   * 过滤掉已选择的树节点
   */
  const filter = (dataSource) => {
    // 过滤掉选中的节点
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
    // 快速创建权限项
    if (modalType === ModalTypeEnum.fast) {
      console.log({ treeData, selectedTree });
      setVisiable(false);
    } else if (modalType === ModalTypeEnum.custom) {
      // 自定义权限项
      // 表单校验
      form.validateFields().then((values) => {
        console.log(values);
        setVisiable(false);
      }).catch((errorInfo) => {
        // 校验未通过
        console.log(errorInfo);
      });
    }
  };
  // 弹框取消按钮回调
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

    // 下拉框选项
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
          <Button type="primary" className="button">
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
    title: "创建权限项",
    onOk: (e) => handleOk(e, {
      modalType, treeData, selectedTree, form
    }),
    onCancel: handleCancel,
    okText: '确定',
    cancelText: '取消',
    width: modalWidth
  };

  const btnProps = {
    type: "primary",
    style: { marginTop: '10px' },
    onClick: () => {
      filter(dataSource);
    }
  };
  const searchProps = {
    style: { width: '300px', marginBottom: '10px' },
    placeholder: "请输入权限项名称或编码",
    onSearch: (value) => {
      console.log(value);
    },
    enterButton: true,
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

  const authTable = {
    treeData,
    tableData,
  };

  return (
    <div className="auth-item flex b1px">
      <aside className="tree-box">
        <BasicTree {...basicTreeProps} />
      </aside>
      <main className="content bl1px">
        <Search {...searchProps}/>
        <TableHeadMenu />
        <AuthTable {...authTable}/>
      </main>
      <Modal {...modalProps}>
        {modalType === ModalTypeEnum.fast ? (
          <div>
            <BasicTreeTransfer {...treeProps} />
            <Button {...btnProps}>一键过滤</Button>
          </div>
        ) : (
          <AuthForm {...formProps}/>
        )}
      </Modal>
    </div>
  );
};
