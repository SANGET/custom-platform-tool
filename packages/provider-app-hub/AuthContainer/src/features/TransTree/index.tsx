import {
  Transfer, Tree, Button, Select
} from 'antd';
import React, { useState } from 'react';

// Customize Table Transfer
const isChecked = (selectedKeys, eventKey) => {
  return selectedKeys.indexOf(eventKey) !== -1;
};

// 设置禁用
const generateTree = (treeNodes = [], checkedKeys = []) => {
  return treeNodes.map(({ children, ...props }) => ({
    ...props,
    disabled: checkedKeys.includes(props.key),
    children: generateTree(children, checkedKeys)
  }));
};

const treeData = [
  { key: '0-0', title: '0-0' },
  {
    key: '0-1',
    title: '0-1',
    children: [
      { key: '0-1-0', title: '0-1-0' },
      {
        key: '0-1-1',
        title: '0-1-1',
        children: [
          { key: '0-1-1-0', title: '0-1-1-0' },
          { key: '0-1-1-1', title: '0-1-1-0' }
        ]
      }
    ]
  },
  {
    key: '0-2',
    title: '0-2',
    children: [
      { key: '0-2-0', title: '0-2-0' },
      { key: '0-2-1', title: '0-2-1' }
    ]
  }
];
/**
 * 树过滤
 * @param {* 树形数据} tree
 * @param {* 过滤条件} filter
 * @param {* 过滤键名} key
 */
const treeFilter = ({ treeData = {}, filter = () => {}, copy = () => {} }) => {
  return treeData.map((tree) => {
    const walkAndCopy = (tree, depth = 1) => {
      const queue = [];
      if (filter(tree)) {
        const copyObj = {};
        copy(tree, copyObj);
        if (tree.children) {
          copyObj.children = [];
          queue.push({
            nodes: tree.children,
            depth: depth + 1,
            copyNodes: copyObj.children
          });
        }
        while (queue.length) {
          const item = queue.pop();
          item.nodes
            && item.nodes.forEach((node) => {
              if (filter(node)) {
                const copyNode = {};
                copy(node, copyNode);
                if (node.children) {
                  copyNode.children = [];
                  queue.push({
                    nodes: node.children,
                    depth: item.depth + 1,
                    copyNodes: copyNode.children
                  });
                }
                item.copyNodes.push(copyNode);
              }
            });
        }
        return copyObj;
      }
    };
    return walkAndCopy(tree);
  });
};

// 递归实现
// @leafId  查找的id，
// @nodes   原始Json数据
// @path    供递归使用
function findPathByLeafId(leafId, nodes, path) {
  if (path === undefined) {
    path = [];
  }
  for (let i = 0; i < nodes.length; i++) {
    const tmpPath = path.concat();
    tmpPath.push(nodes[i].key);
    if (leafId === nodes[i].key) {
      return tmpPath;
    }
    if (nodes[i].children) {
      const findResult = findPathByLeafId(leafId, nodes[i].children, tmpPath);
      if (findResult) {
        return findResult;
      }
    }
  }
}

const TreeTransfer = ({
  dataSource,
  selectTree,
  targetKeys,
  filterParams,
  treeFilter,
  ...restProps
}) => {
  // const transferDataSource = [];
  // function flatten(list = []) {
  //   list.forEach((item) => {
  //     transferDataSource.push(item);
  //     flatten(item.children);
  //   });
  // }
  // flatten(dataSource);

  // console.log('tree,dataSource', dataSource, generateTree(dataSource, targetKeys));

  return (
    <Transfer
      {...restProps}
      targetKeys={targetKeys}
      dataSource={dataSource}
      className="tree-transfer"
      render={(item) => item.title}
      showSelectAll={false}
    >
      {({ direction, onItemSelect, selectedKeys }) => {
        if (direction === 'left') {
          const checkedKeys = [...selectedKeys, ...targetKeys];
          return (
            <Tree
              blockNode
              checkable
              checkStrictly
              defaultExpandAll
              checkedKeys={checkedKeys}
              treeData={dataSource}
              onCheck={(_, { node: { key } }) => {
                onItemSelect(key, !isChecked(checkedKeys, key));
              }}
              onSelect={(_, { node: { key } }) => {
                onItemSelect(key, !isChecked(checkedKeys, key));
              }}
            />
          );
        }
        return <Tree blockNode checkStrictly defaultExpandAll treeData={selectTree} />;
      }}
    </Transfer>
  );
};

export default () => {
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectTree, setSelectTree] = useState([]);
  const [dataSource, setDataSource] = useState(treeData);

  // 移动节点之后触发的事件
  const onChange = (targetKeys) => {
    console.log('Target Keys:', targetKeys);
    setTargetKeys(targetKeys);
    setSelectTree([]);

    targetKeys.map((key) => {
      return console.log(findPathByLeafId(key, treeData));
    });

    // setSelectTree([]);

    // // 过滤掉选中的节点
    // const reserveTree = treeFilter({
    //   treeData: dataSource,
    //   copy: (src, dest) => {
    //     dest.title = src.title;
    //     dest.key = src.key;
    //   },
    //   filter: (node) => {
    //     return !targetKeys.includes(node.key);
    //   }
    // });

    // console.log('filter:', reserveTree, generateTree(treeData, targetKeys));

    // setDataSource(reserveTree);
  };

  const filterParams = {
    tree: treeData,
    copy: (src, dest) => {
      dest.title = src.title;
      dest.key = src.key;
    },
    filter: (node) => {
      return !node.disabled;
    }
  };

  const filter = (targetKeys) => {
    console.log('findPathByLeafId', findPathByLeafId('0-1-0', treeData));

    // console.log(
    //   'filter:',
    //   treeFilter({
    //     treeData: treeData,
    //     copy: (src, dest) => {
    //       dest.title = src.title
    //       dest.key = src.key
    //     },
    //     filter: (node) => {
    //       return node.disabled
    //     },
    //   })
    // )
  };

  return (
    <div>
      <TreeTransfer
        dataSource={dataSource}
        selectTree={selectTree}
        targetKeys={targetKeys}
        onChange={onChange}
        treeFilter={treeFilter}
        filterParams={filterParams}
      />
      <Button type="primary" style={{ marginTop: '10px' }} onClick={filter}>
        一键过滤
      </Button>
    </div>
  );
};
