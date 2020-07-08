import {
  Transfer, Tree, Button, Select
} from 'antd';
import React, { useState } from 'react';

const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' }
        ]
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' }
        ]
      },
      {
        title: '0-0-2',
        key: '0-0-2'
      }
    ]
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0' },
      { title: '0-1-0-1', key: '0-1-0-1' },
      { title: '0-1-0-2', key: '0-1-0-2' }
    ]
  },
  {
    title: '0-2',
    key: '0-2'
  }
];

const { SHOW_PARENT } = Tree;

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

// const treeData = [
//   { key: '0-0', title: '0-0' },
//   {
//     key: '0-1',
//     title: '0-1',
//     children: [
//       { key: '0-1-0', title: '0-1-0' },
//       {
//         key: '0-1-1',
//         title: '0-1-1',
//         children: [
//           { key: '0-1-1-0', title: '0-1-1-0' },
//           { key: '0-1-1-1', title: '0-1-1-1' }
//         ]
//       }
//     ]
//   },
//   {
//     key: '0-2',
//     title: '0-2',
//     children: [
//       { key: '0-2-0', title: '0-2-0' },
//       { key: '0-2-1', title: '0-2-1' }
//     ]
//   }
// ];
/**
 * 树过滤
 * @param {* 树形数据} tree
 * @param {* 过滤条件} filter
 * @param {* 过滤键名} key
 */
const treeFilter = ({ treeData = {}, filter = () => {}, copy = () => {} }) => {
  const rootNode = treeData.map((tree) => {
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

  // 过滤掉根节点中为undefined
  return rootNode.filter((item) => item);
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

  // const [expandedKeys, setExpandedKeys] = useState<string[]>(['0-0-0', '0-0-1']);
  // // const [checkedKeys, setCheckedKeys] = useState<string[]>(['0-0-0']);
  // const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  // const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  // const onExpand = (expandedKeys) => {
  //   console.log('onExpand', expandedKeys);
  //   // if not set autoExpandParent to false, if children expanded, parent can not collapse.
  //   // or, you can remove all expanded children keys.
  //   setExpandedKeys(expandedKeys);
  //   setAutoExpandParent(false);
  // };

  // const onCheck = (checkedKeys, cb) => {
  //   console.log('onCheck', checkedKeys);
  //   setCheckedKeys(checkedKeys);
  //   cb(checkedKeys);
  // };

  // const onSelect = (selectedKeys, info) => {
  //   console.log('onSelect', info);
  //   setSelectedKeys(selectedKeys);
  // };

  return (
    <Transfer
      {...restProps}
      targetKeys={targetKeys}
      dataSource={dataSource}
      className="tree-transfer"
      render={(item) => item.title}
      showSelectAll={true}
    >
      {({ direction, onItemSelect, selectedKeys }) => {
        if (direction === 'left') {
          const checkedKeys = [...selectedKeys, ...targetKeys];
          return (
            <Tree
              checkable
              draggable
              defaultExpandAll
              // onExpand={onExpand}
              // expandedKeys={expandedKeys}
              // autoExpandParent={autoExpandParent}
              onCheck={(_, { node: { key } }) => {
                // setCheckedKeys(checkedKeys);
                onItemSelect(key, !isChecked(checkedKeys, key));
              }}
              checkedKeys={checkedKeys}
              onSelect={(_, { node: { key } }) => {
                onItemSelect(key, !isChecked(checkedKeys, key));
              }}
              selectedKeys={selectedKeys}
              treeData={dataSource}
            />
            // <Tree
            //   blockNode
            //   checkable
            //   checkStrictly
            //   defaultExpandAll
            //   checkedKeys={checkedKeys}
            //   showCheckedStrategy={SHOW_PARENT}
            //   treeData={dataSource}
            //   onCheck={(_, { node: { key } }) => {
            //     onItemSelect(key, !isChecked(checkedKeys, key));
            //   }}
            //   onSelect={(_, { node: { key } }) => {
            //     onItemSelect(key, !isChecked(checkedKeys, key));
            //   }}
            // />
          );
        }
        return <Tree blockNode={true} defaultExpandAll treeData={selectTree} />;
      }}
    </Transfer>
  );
};

export default () => {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectTree, setSelectTree] = useState<string[]>([]);
  const [dataSource, setDataSource] = useState<string[]>(treeData);

  // 移动节点之后触发的事件
  const onChange = (targetKeys) => {
    console.log('Target Keys:', targetKeys);
    setTargetKeys(targetKeys);

    // 根据选中的节点的key生成选中节点树
    setSelectTree(chooseNode(treeData, targetKeys));

    // 过滤掉选中的节点
    const reserveTree = treeFilter({
      treeData: dataSource,
      copy: (src, dest) => {
        dest.title = src.title;
        dest.key = src.key;
      },
      filter: (node) => {
        // 返回true的节点会被保留
        return !targetKeys.includes(node.key);
      }
    });

    setDataSource(reserveTree);
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

type UserInfo = {
  name: string;
  age: number;
};

function chooseNode(nodes: [], targetKeys: string[]) {
  return nodes
    .map((node) => {
      // 若有子节点，递归处理
      // 按上述规则，返回的数组如果有元素，说明子孙级有节点被选中
      const children = node.children && node.children.length ? chooseNode(node.children, targetKeys) : [];

      // - 如果子孙级有节点被先中：children.length 有值且 =>0
      // - 或者当前节点在 keysSet 中：keysSet.has(...)
      // ⇒ 那么当前节点被选中，生成对应的数据（新节点）
      if (children.length || targetKeys.includes(node.key)) {
        const newNode = {
          key: node.key,
          title: node.title
        };
        if (children.length) {
          newNode.children = children;
        }
        return newNode;
      }

      // 否则当前节点不需要选中，返回 null
      return null;
    })
    .filter((node) => node);
}
