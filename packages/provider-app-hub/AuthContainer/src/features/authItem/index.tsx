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
import TreeTransfer from '@provider-app/auth-manager/src/common/Components/TreeTransfer';
import BasicTree from '@provider-app/auth-manager/src/common/Components/Tree';
import { treeData } from './mock';
import CustomAuth from './CustomAuth';

import EditTable from '../EditTable';
import {
  generateSelectedTree, treeFilter, disTreeNode, selectedTreeData
} from './tool';
import './authItem.less';

const { Search } = Input;

export default () => {
  const [dataSource, setDataSource] = useState(treeData);
  const [visible, setVisiable] = useState(true);
  const [modalType, setModalType] = useState('自定义');
  const [modalWidth, setModalWidth] = useState(520);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectedTree, setSelectedTree] = useState(selectedTreeData);

  // 移动节点之后触发的事件
  const onChange = (targetKeys) => {
    console.log('Target Keys:', targetKeys);
    setTargetKeys(targetKeys);
    setDataSource(disTreeNode(dataSource, targetKeys));
    // 根据选中的节点的key生成选中节点树
    setSelectedTree(generateSelectedTree(treeData, targetKeys));
    console.log(generateSelectedTree(treeData, targetKeys));
  };
  const filter = () => {
    // 过滤掉选中的节点
    const reserveTree = treeFilter({
      treeData: dataSource,
      copy: (src) => {
        const { key, title } = src;
        return {
          key,
          title
        };
      },
      filter: (node) => !node.disabled
      // 返回true的节点会被保留
      // return !targetKeys.includes(node.key);
    });
    // const reserveTree = treeFilter({
    //   treeData: dataSource,
    //   copy: (src, dest) => {
    //     dest.title = src.title;
    //     dest.key = src.key;
    //   },
    //   filter: (node) => {
    //     return !node.disabled;
    //   }
    // });
    console.log(reserveTree);

    setDataSource(reserveTree);
  };
  /**
   * 拖拽位置处理
   * @param info ={event, node, dragNode, dragNodesKeys}
   * @param node 目标节点
   * @param dragNode 拖拽节点
   * @param dragNodesKeys 拖拽节点的key
   * @param event 拖拽dom事件属性
   * @param dropToGap: 代表连接到节点之间的缝隙中，为true,表示拖拽与目标节点是前后邻居关系，为false表示拖拽与目标节点是子节点关系。
   * @param dropPosition antd 依赖了 rc-tree，在 rc-tree 里 dropPosition 是一个相对地址。
   * 如果拖到了目标节点的上面是 -1，下面则是 1。antd 里则是相对于目标节点的 index。
   * 如果拖动时正好落在该节点上，dropPosition 就是该节点的 index。
   * 如果落在目标节点的上方, dropPosition=目标节点的index-1
   * 如果落在目标节点的下方, dropPosition=目标节点的index+1
   */
  const onDrop = (info) => {
    const {
      event, node, dragNode, dragNodesKeys
    } = info;
    // console.log(info, event, node, dragNode, dragNodesKeys);
    /** 目标节点的key */
    const dropKey = node.key;
    /** 拖拽节点的key */
    const dragKey = dragNode.key;
    /** 目标节点在其父节点下的路径,最后一位是子节点的序号 */
    const dropPos = node.pos.split('-');
    // 计算相对位置
    // dropPosition=-1,拖拽节点被拖拽到目标节点上方
    // dropPosition=0,拖拽节点被拖拽到目标节点上
    // dropPosition=1,拖拽节点被拖拽到目标节点下方
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    // console.log(info.dropToGap, info.dropPosition, dropPos, node, dropPosition);

    // 根据节点的key,从data对象中找到对应节点的完整属性
    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = [...dataSource];
    let dragObj; // 存放被拖拽的节点
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1); // 从data对象中删除被拖拽元素
      dragObj = item;
    });
    // 拖拽节点是目标节点的子节点
    if (!info.dropToGap) {
      // 找到目标节点,把拖拽节点添加到目标节点子节点的尾部
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.push(dragObj);
      });
    } // 拖拽与目标节点是前后相邻关系
    else {
      let ar; // 存放剔除了被拖拽节点的树形节点集合
      let i; // 存放放置节点的位置
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      // 将拖拽节点移动到目标节点上方
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        // 将拖拽节点移动到目标节点下方
        ar.splice(i + 1, 0, dragObj);
      }
    }

    // console.log(data);
    setDataSource(data);
  };
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

  const handleOk = (e) => {
    setVisiable(false);
    console.log(e);
  };
  const handleCancel = (e) => {
    console.log(e);
    setVisiable(false);
  };

  const menu = (
    <Menu onClick={dropdownClick}>
      <Menu.Item key="快速">快速创建权限项</Menu.Item>
      <Menu.Item key="自定义">自定义创建权限项</Menu.Item>
    </Menu>
  );
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onTreeSearch = (e) => {
    const { value } = e.target;
    const expandedKeys = dataList
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, gData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);

    setExpandedKeys(expandedKeys);
    setAutoExpandParent(true);
    setSearchValue(value);
  };

  return (
    <div className="flex b1px">
      <aside className="tree-box">
        <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onTreeSearch} />
        <BasicTree
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
        ></BasicTree>
      </aside>
      <main className="content bl1px">
        <Search
          style={{ width: '300px', marginBottom: '10px' }}
          size="large"
          placeholder="请输入权限项名称或编码"
          onSearch={(value) => console.log(value)}
          enterButton
        />
        <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
          <Button>创建权限项</Button>
        </Dropdown>
        <EditTable title={() => '权限项列表'} />
      </main>
      <Modal
        title="创建权限项"
        visible={visible}
        onOk={handleOk}
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
              draggable={true}
              onDrop={onDrop}
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
