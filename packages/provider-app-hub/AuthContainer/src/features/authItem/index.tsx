/*
 * @Author: wangph
 * @Date: 2020-07-10 12:00:29
 * @Last Modified by:   wangph
 * @Last Modified time: 2020-07-10 12:00:29
 */
import React, { useState } from 'react';
import {
  Menu, Dropdown, Button, Input, Modal
} from 'antd';
// 可复用组件
import TreeTransfer from '@provider-app/auth-manager/src/common/Components/TreeTransfer';
import BasicTree from '@provider-app/auth-manager/src/common/Components/Tree';

// 业务组件
import CustomAuth from './CustomAuth';
import EditTable from '../EditTable';

// 模拟数据
import { treeData } from './mock';

// 不会改变state状态的方法,无生命周期的方法
import { generateSelectedTree, treeFilter, disTreeNode } from './authItem';

// 当前功能页样式
import './authItem.less';

export default () => {
  const { Search } = Input;
  // 更新树形组件数据源
  const [dataSource, setDataSource] = useState(treeData);
  // 设置模块框的显示隐藏
  const [visible, setVisiable] = useState<boolean>(true);
  // 区分模态框展示的内容
  const [modalType, setModalType] = useState<string>('快速');
  // 设置模态框的宽度
  const [modalWidth, setModalWidth] = useState<string>('60%');
  // 更新选择的树节点key集合
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  // 更新选中树数据源
  const [selectedTree, setSelectedTree] = useState([]);

  // 穿梭框移动节点之后触发的事件
  const onChange = (targetKeys) => {
    // console.log('Target Keys:', targetKeys);
    setTargetKeys(targetKeys);
    setDataSource(disTreeNode(dataSource, targetKeys));
    // 根据选中的节点的key生成选中节点树
    setSelectedTree(generateSelectedTree(treeData, targetKeys));
    // console.log(generateSelectedTree(treeData, targetKeys));
  };
  // 过滤掉已选择的树节点
  const filter = () => {
    // 过滤掉选中的节点
    // const reserveTree = treeFilter(dataSource);
    const reserveTree = treeFilter({
      treeData: dataSource,
      // copy: (src) => {
      //   const { key, title } = src;
      //   return {
      //     key,
      //     title
      //   };
      // },
      filter: (node) => !node.disabled
    });
    console.log(reserveTree);
    setDataSource(reserveTree);
  };
  // 下拉菜单点击触发事件
  const dropdownClick = (e) => {
    const { key } = e;
    console.log(e);
    setModalType(key);
    switch (key) {
      case '自定义': {
        setModalWidth(520);
        setVisiable(true);
        break;
      }
      case '快速': {
        setModalWidth('60%');
        setVisiable(true);
        break;
      }
    }
  };
  // 弹框确定按钮回调
  const handleOk = (e, { modalType, treeData, selectedTree }) => {
    if (modalType === '快速') {
      console.log({ treeData, selectedTree });
    } else {
      console.log(e);
    }
    setVisiable(false);
  };
  // 弹框取消按钮回调
  const handleCancel = (e) => {
    console.log(e);
    setVisiable(false);
  };
  // 下拉框选项
  const menu = (
    <Menu onClick={dropdownClick}>
      <Menu.Item key="快速">快速创建权限项</Menu.Item>
      <Menu.Item key="自定义">自定义创建权限项</Menu.Item>
    </Menu>
  );
  // const onFinish = (values) => {
  //   console.log('Received values of form: ', values);
  // };

  const TableHeadMenu = () => (
    <section className="table-head-menu">
      <div className="ant-table-title">权限项列表</div>
      <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
        <Button type="primary" className="button">
          创建权限项
        </Button>
      </Dropdown>
    </section>
  );

  return (
    <div className="auth-item flex b1px">
      <aside className="tree-box">
        <BasicTree treeData={dataSource}></BasicTree>
      </aside>
      <main className="content bl1px">
        <Search
          style={{ width: '300px', marginBottom: '10px' }}
          placeholder="请输入权限项名称或编码"
          onSearch={(value) => console.log(value)}
          enterButton
        />
        <TableHeadMenu />
        <EditTable />
      </main>
      <Modal
        title="创建权限项"
        visible={visible}
        onOk={(e) => handleOk(e, { modalType, treeData, selectedTree })}
        onCancel={handleCancel}
        okText={'确定'}
        cancelText={'取消'}
        width={modalWidth}
      >
        {modalType === '快速' ? (
          <div>
            <TreeTransfer
              dataSource={dataSource}
              selectedTree={selectedTree}
              targetKeys={targetKeys}
              disTreeNode={disTreeNode}
              onChange={onChange}
            />
            <Button
              type="primary"
              style={{ marginTop: '10px' }}
              onClick={(targetKeys) => {
                filter(targetKeys);
              }}
            >
              一键过滤
            </Button>
          </div>
        ) : (
          <CustomAuth onFinish />
        )}
      </Modal>
    </div>
  );
};
