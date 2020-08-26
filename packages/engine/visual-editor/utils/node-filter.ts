/**
 * 用于记录嵌套关系的信息集合
 */
const layoutNodeNestingInfo = {};

let NodeTree;
let FlatNodeTree;

/**
 * 获取 node tree
 */
export const getLayoutNodeTree = () => NodeTree;

/**
 * 获取扁平的 node tree 数据结构
 */
export const getLayoutContentCollection = () => FlatNodeTree;

export const setNodeTree = (nodeTree, flatNodeTree) => {
  /** 设置 NodeTree */
  NodeTree = nodeTree;
  FlatNodeTree = flatNodeTree;
};

/**
 * @author 相杰
 * @important 基础算法，慎重修改
 *
 * 设置 NodeTree 嵌套信息，用于防止自身嵌套到自身自容器中，导致无限递归引用
 */
export const setNodeTreeNestingInfo = (nodeTree, flatNodeTree) => {
  /** 设置 NodeTree */
  setNodeTree(nodeTree, flatNodeTree);

  /** 处理 nodeTree */
  Object.keys(flatNodeTree).forEach((nodeID) => {
    const node = flatNodeTree[nodeID];
    const { parentID } = node;
    if (parentID) {
      if (!layoutNodeNestingInfo[parentID]) layoutNodeNestingInfo[parentID] = new Set();
      layoutNodeNestingInfo[parentID].add(node.id);
    }
  });
  // console.log(layoutNodeNestingInfo);
};

/**
 * 判断 Node 是否在子 Node 中
 */
export const isNodeInChild = (srcNodeID, targetNodeID) => {
  // console.log(layoutNodeNestingInfo);
  return !!layoutNodeNestingInfo[targetNodeID]
    && layoutNodeNestingInfo[targetNodeID].has(srcNodeID);
  // console.log(layoutNodeArray);
};
