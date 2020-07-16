const treeData = [
  {
    title: '基础模块',
    key: 'basicModule',
    children: [
      {
        title: '基础数据',
        key: 'basicData',
        children: [
          { title: '人员管理', key: 'staffMangager' },
          { title: '人员信息查询', key: 'staffInfo' },
          { title: '岗位信息', key: 'jobInfo' }
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

// const treeData = [
//   {
//     title: '0-0',
//     key: '0-0',
//     children: [
//       {
//         title: '0-0-0',
//         key: '0-0-0',
//         children: [
//           { title: '0-0-0-0', key: '0-0-0-0' },
//           { title: '0-0-0-1', key: '0-0-0-1' },
//           { title: '0-0-0-2', key: '0-0-0-2' }
//         ]
//       },
//       {
//         title: '0-0-1',
//         key: '0-0-1',
//         children: [
//           { title: '0-0-1-0', key: '0-0-1-0' },
//           { title: '0-0-1-1', key: '0-0-1-1' },
//           { title: '0-0-1-2', key: '0-0-1-2' }
//         ]
//       },
//       {
//         title: '0-0-2',
//         key: '0-0-2'
//       }
//     ]
//   },
//   {
//     title: '0-1',
//     key: '0-1',
//     children: [
//       { title: '0-1-0-0', key: '0-1-0-0' },
//       { title: '0-1-0-1', key: '0-1-0-1' },
//       { title: '0-1-0-2', key: '0-1-0-2' }
//     ]
//   },
//   {
//     title: '0-2',
//     key: '0-2'
//   }
// ];

const selectedTreeData = [

];

interface TreeNodeType{
  title:string
  key:string
  children:TreeNodeType[]
}
/**
 * 移动节点之后的禁止选择
 * @param treeNodes    整棵树
 * @param checkedKeys  选中节点
 */
const disTreeNode = (treeNodes, checkedKeys) => {
  return treeNodes.map(({ children, ...props }) => ({
    ...props,
    disabled: checkedKeys.includes(props.key),
    children: children && disTreeNode(children, checkedKeys)
  }));
};

/**
 * 树过滤--过滤以选中节点
 * @param {* 树形数据} tree
 * @param {* 过滤条件} filter
 * @param {* 过滤键名} key
 */
// const treeFilter = ({ treeData = {}, filter = () => {}, copy = () => {} }) => {
//   const rootNode = treeData.map((tree) => {
//     const walkAndCopy = (tree, depth = 1) => {
//       const queue = [];
//       if (filter(tree)) {
//         const copyObj = {};
//         copy(tree, copyObj);
//         if (tree.children) {
//           copyObj.children = [];
//           queue.push({
//             nodes: tree.children,
//             depth: depth + 1,
//             copyNodes: copyObj.children
//           });
//         }
//         while (queue.length) {
//           const item = queue.pop();
//           item.nodes
//             && item.nodes.forEach((node) => {
//               if (filter(node)) {
//                 const copyNode = {};
//                 copy(node, copyNode);
//                 if (node.children) {
//                   copyNode.children = [];
//                   queue.push({
//                     nodes: node.children,
//                     depth: item.depth + 1,
//                     copyNodes: copyNode.children
//                   });
//                 }
//                 item.copyNodes.push(copyNode);
//               }
//             });
//         }
//         return copyObj;
//       }
//     };
//     return walkAndCopy(tree);
//   });

//   // 过滤掉根节点中为undefined
//   return rootNode.filter((item) => item);
// };

/**
 * 树过滤--过滤掉选中的节点
 * @param {* 树形数据} tree
 * @param {* 过滤函数} filter
 * @param {* 过滤键名} key
 */
const treeFilter = ({ treeData, filter, copy }) => {
  const rootNode = treeData.map((tree) => {
    const walkAndCopy = (tree, depth = 1) => {
      const queue = [];
      if (filter(tree)) {
        let copyObj = {};
        copyObj = { ...copy(tree) };

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
                copyObj = { ...copy(node) };
                copyObj = Object.assign({}, copy(node));
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
/**
 * 生成选择树
 * @param nodes 树形源数据
 * @param targetKeys 选中的节点key集合
 */
const generateSelectedTree = (nodes, targetKeys) => {
  return nodes
    .map((node) => {
      // 若有子节点，递归处理
      // 按上述规则，返回的数组如果有元素，说明子孙级有节点被选中
      const children = node.children && node.children.length ? generateSelectedTree(node.children, targetKeys) : [];

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
};

// const generateSelectedTree = (nodes, targetKeys) => {
//   return nodes.map((node) => {
//     // 若有子节点，递归处理
//     // 按上述规则，返回的数组如果有元素，说明子孙级有节点被选中
//     if (node.children) {
//       const children = generateSelectedTree(node.children, targetKeys);

//       // - 如果子孙级有节点被先中：children.length 有值且 =>0
//       // - 或者当前节点在 targetKeys 中
//       //  那么当前节点被选中，生成对应的数据（新节点）
//       if (children || targetKeys.includes(node.key)) {
//         const newNode = Object.assign({}, {
//           key: node.key,
//           title: node.title
//         }, children && {
//           children
//         });
//         return newNode;
//       }
//     }
//     // 否则当前节点不需要选中，返回 null
//     return null;
//   })
//     .filter((node) => node);
// };

export {
  generateSelectedTree, treeFilter, disTreeNode, treeData, selectedTreeData
};
