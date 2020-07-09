import React, { useState } from 'react';
import { Button } from 'antd';
import TreeTransfer from '@provider-app/auth-manager/src/common/Components/TreeTransfer';
import {
  generateSelectedTree, treeFilter, disTreeNode, treeData, selectedTreeData
} from './tool';

export default () => {
  const [dataSource, setDataSource] = useState(treeData);
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
    // const reserveTree = treeFilter({
    //   treeData: dataSource,
    //   copy: (src) => {
    //     const { key, title } = src;
    //     return {
    //       key,
    //       title
    //     };
    //   },
    //   filter: (node) => {
    //     // 返回true的节点会被保留
    //     return !targetKeys.includes(node.key);
    //   }
    // });
    const reserveTree = treeFilter({
      treeData: dataSource,
      copy: (src, dest) => {
        dest.title = src.title;
        dest.key = src.key;
      },
      filter: (node) => {
        return !node.disabled;
      }
    });
    console.log(reserveTree);

    setDataSource(reserveTree);
  };
  const onDrop = (info) => {
    const {
      event, node, dragNode, dragNodesKeys
    } = info;
    console.log(event, node, dragNode, dragNodesKeys);
    /** 放下的节点的key */
    const dropKey = node.key;
    /** 拖过来的节点的key */
    const dragKey = dragNode.key;
    /** 放下的节点的路径 */
    const dropPos = node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    // console.log(info.dropPosition, dropPosition);

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

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj);
      });
    } else if (
      (node.children || []).length > 0 // Has children
      && info.node.props.expanded // Is expanded
      && dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    // console.log(data);
    setDataSource(data);
  };

  return (
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
      <Button type="primary" style={{ marginTop: '10px' }} onClick={filter}>
        一键过滤
      </Button>
    </div>
  );
};
