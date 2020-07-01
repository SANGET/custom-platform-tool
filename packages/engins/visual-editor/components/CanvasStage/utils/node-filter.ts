const layoutNodeNestingInfo = {};

/**
 *
 */
export const setNodeArrayInfo = (nodeArray, layoutObj) => {
  Object.keys(layoutObj).map((nodeID) => {
    const node = layoutObj[nodeID];
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
