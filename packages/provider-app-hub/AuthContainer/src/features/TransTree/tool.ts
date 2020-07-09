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

/**
 * 移动节点之后的禁止选择
 * @param treeNodes    整棵树
 * @param checkedKeys  选中节点
 */
const disTreeNode = (treeNodes = [], checkedKeys = []) => {
  return treeNodes.map(({ children, ...props }) => ({
    ...props,
    disabled: checkedKeys.includes(props.key),
    children: disTreeNode(children, checkedKeys)
  }));
};

/**
 * 树过滤--过滤掉选中的节点
 * @param {* 树形数据} tree
 * @param {* 过滤函数} filter
 * @param {* 过滤键名} key
 */
const treeFilter = ({ treeData = {}, filter = () => {}, copy = () => {} }) => {
  const rootNode = treeData.map((tree) => {
    const walkAndCopy = (tree, depth = 1) => {
      const queue = [];
      if (filter(tree)) {
        const copyObj = {};

        copyObj = Object.assign({}, copy(tree));
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
                // copyObj = { ...copy(node) };
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
// const treeFilter = ({ treeData = [], filter, copy }) => {
//   // 遍历根节点的第一级节点
//   return treeData.map((tree) => {
//     const walkAndCopy = (tree) => {
//       const queue = [];
//       // 复制满足条件的第一级节点
//       if (filter(tree)) {
//         // 收集满足条件的对象
//         let copyObj = {};
//         // 在copy方法里可以自定义复制哪些内容
//         copyObj = { ...copy(tree) };

//         // 循环开始的条件
//         if (tree.children) {
//           // 用children字段将子节点串起来
//           copyObj.children = [];
//           queue.push(tree.children);
//         }

//         // 循环遍历
//         while (queue.length) {
//           // 取出队列项
//           const item = queue.pop();
//           item && item.forEach((node) => {
//             if (filter(node)) {
//               const copyNode = {};
//               // 将新节点复制到符合复制条件的对象里
//               copyObj = { ...copy(node) };
//               if (node.children) {
//                 copyNode.children = [];
//                 // 添加新的项到队列,有子节点继续循环
//                 queue.push(node.children);
//               }
//             }
//           });
//         }
//         return copyObj;
//       }
//       // 不符合条件返回 null
//       return null;
//     };
//     return walkAndCopy(tree);
//   }).filter((item) => item);
// };

const generateSelectedTree = (nodes: [], targetKeys: string[]) => {
  return nodes
    .map((node) => {
      // 若有子节点，递归处理
      // 按上述规则，返回的数组如果有元素，说明子孙级有节点被选中
      const children = node.children && node.children.length ? generateSelectedTree(node.children, targetKeys) : [];

      // - 如果子孙级有节点被先中：children.length 有值且 =>0
      // - 或者当前节点在 targetKeys 中
      //  那么当前节点被选中，生成对应的数据（新节点）
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

export {
  generateSelectedTree, treeFilter, disTreeNode, treeData
};
