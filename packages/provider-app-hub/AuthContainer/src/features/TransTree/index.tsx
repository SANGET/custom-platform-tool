import React, { useState } from 'react';
import { Button } from 'antd';
import TreeTransfer from '@provider-app/auth-manager/src/common/Components/TreeTransfer';
import {
  generateSelectedTree, treeFilter, disTreeNode, treeData
} from './tool';

export default () => {
  const [dataSource, setDataSource] = useState(treeData);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectedTree, setSelectedTree] = useState<string[]>([]);

  // 移动节点之后触发的事件
  const onChange = (targetKeys) => {
    console.log('Target Keys:', targetKeys);
    setTargetKeys(targetKeys);
    setDataSource(disTreeNode(dataSource, targetKeys));
    // 根据选中的节点的key生成选中节点树
    setSelectedTree(generateSelectedTree(treeData, targetKeys));
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
      filter: (node) => {
        // 返回true的节点会被保留
        return !targetKeys.includes(node.key);
      }
    });
    console.log(reserveTree);

    setDataSource(reserveTree);
  };

  return (
    <div>
      <TreeTransfer
        dataSource={dataSource}
        selectedTree={selectedTree}
        targetKeys={targetKeys}
        disTreeNode={disTreeNode}
        onChange={onChange}
      />
      <Button type="primary" style={{ marginTop: '10px' }} onClick={filter}>
        一键过滤
      </Button>
    </div>
  );
};
