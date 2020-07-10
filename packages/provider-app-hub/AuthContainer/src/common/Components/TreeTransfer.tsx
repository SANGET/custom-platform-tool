import { Transfer, Tree } from 'antd';
import React, { FC } from 'react';

const TreeTransfer: FC = ({
  dataSource,
  selectedTree,
  targetKeys,
  treeFilter,
  disTreeNode,
  draggable
  onDrop
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
              draggable
              defaultExpandAll
              checkedKeys={checkedKeys}
              selectedKeys={selectedKeys}
              treeData={dataSource}
              onDrop={onDrop}
              onCheck={(_, { node: { key } }) => {
                // 点击了树节点前面的复选框触发的事件
                console.log('xxx',_,key);
                /*  */
                onItemSelect(key, !isChecked(checkedKeys, key));
              }}
              onSelect={(_, { node: { key } }) => {
                /**onSelect点击了树节点的文字触发的事件 */
                console.log('onSelect',_);
                // onItemSelect(key, !isChecked(checkedKeys, key));
              }}
            />
          );
        }
        return <Tree blockNode={true}  treeDefaultExpandAll={true} treeData={selectedTree} />;
      }}
    </Transfer>
  );
};
export default TreeTransfer;
