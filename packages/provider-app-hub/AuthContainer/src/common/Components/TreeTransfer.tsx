import { Transfer, Tree } from 'antd';
import React, { FC } from 'react';
import { treeData } from '../../features/TransTree/tool';

const TreeTransfer: FC = ({
  dataSource,
  selectedTree,
  targetKeys,
  treeFilter,
  disTreeNode,
  ...restProps
}) => {
  const isChecked = (selectedKeys, eventKey) => {
    return selectedKeys.indexOf(eventKey) !== -1;
  };

  return (
    <Transfer
      {...restProps}
      targetKeys={targetKeys}
      dataSource={dataSource}
      className="tree-transfer"
      render={(item) => item.title}
      oneWay
      showSelectAll={false}
    >
      {({
        direction, onItemSelect, selectedKeys, filteredItems
      }) => {
        // console.log('filteredItems=', filteredItems, selectedKeys);
        if (direction === 'left') {
          const checkedKeys = [...selectedKeys, ...targetKeys];
          return (
            <Tree
              checkable
              defaultExpandAll
              checkedKeys={checkedKeys}
              selectedKeys={selectedKeys}
              treeData={treeData}
              onCheck={(_, { node: { key } }) => {
                onItemSelect(key, !isChecked(checkedKeys, key));
              }}
              onSelect={(_, { node: { key } }) => {
                onItemSelect(key, !isChecked(checkedKeys, key));
              }}
            />
          );
        }
        return <Tree blockNode={true} defaultExpandAll treeData={selectedTree} />;
      }}
    </Transfer>
  );
};
export default TreeTransfer;
