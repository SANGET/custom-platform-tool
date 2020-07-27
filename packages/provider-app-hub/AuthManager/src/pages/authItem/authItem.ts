/*
 * @Author: wph
 * @Date: 2020-07-22 09:23:52
 * @LastEditTime: 2020-07-23 16:46:14
 * @LastEditors: Please set LastEditors
 * @Description: 权限功能单元与页面状态无关的方法
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\AuthManager\src\features\authItem\authItem.ts
 */
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
 * 树过滤--过滤掉选中的节点
 * @param {* 树形数据} treeData
 * @param {* 过滤函数} filter
 */
const treeFilter = ({ treeData, filter }) => treeData.map((item) => {
  const {
    key, title, children
  } = item;

  if (filter(item)) {
    // 如果有子节点，继续循环
    if (children) {
      return { title, key, children: treeFilter({ treeData: children, filter }) };
    }

    return {
      title,
      key
    };
  }
  return null;
}).filter((item) => item);

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

export {
  generateSelectedTree, treeFilter, disTreeNode
};
