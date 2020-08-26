import { mergeDeep } from "@infra/utils/tools";

/**
 * 扁平的 Node 数据结构，通过 parentID 关联自身
 */
interface FlatNode {
  parentID?: string;
}

/**
 * 有嵌套结构的 NodeTree 数据结构
 */
interface NestingNode extends FlatNode {
  id: string;
}

/**
 * 将扁平的对象结构转换成 nestingTreeNode 结构
 *
 * @author 相杰
 * @important 基础算法，慎重修改
 */
export const parseFlatNodeToNestNode = <T extends NestingNode = NestingNode>(
  flatNode: FlatNode
): T[] => {
  const res: T[] = [];

  /**
   * 需要切断 flatNode 的所有成员属性的原型链
   */
  const srcCloneObj = mergeDeep({}, flatNode);

  Object.keys(srcCloneObj).forEach((colID) => {
    const currItem = srcCloneObj[colID];
    const resObj = Object.assign(currItem, {
      id: colID,
      ...currItem
    });

    /**
     * 通过原型链将子 node 挂载到父 node 上
     */
    if (currItem.parentID) {
      const parentObj = srcCloneObj[currItem.parentID];
      if (!Array.isArray(parentObj.body)) parentObj.body = [];
      parentObj.body.push(currItem);
    } else {
      res.push(resObj);
    }
  });

  return res;
};

// const exp = {
//   1: {
//     parentID: 2,
//     name: '1'
//   },
//   2: {
//     name: '2'
//   },
//   3: {
//     parentID: 2,
//     name: '3'
//   },
//   4: {
//     parentID: 3,
//     name: '3'
//   },
// };

// console.log(parseFlatNodeToNestNode(exp));
