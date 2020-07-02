import { mergeDeep } from "./deepmerge";

/**
 * 生产自增 ID 的工厂类
 */
const increaseIDFac = (idCount = 0) => () => {
  // eslint-disable-next-line no-param-reassign
  idCount += 1;
  return String(idCount);
};
/**
 * 生产自增 ID 具体实现
 */
export const increaseID = increaseIDFac(0);

/**
 * 生产 ID
 */
export const wrapID = (...args) => {
  return args.join('_');
};

interface ParseObjToTreeNodeSchema {
  parentID?: string | number;
}
interface ParseObjToTreeNodeReturnSchema extends ParseObjToTreeNodeSchema {
  id: string | number;
}

/**
 * 将扁平的对象结构转换成 treeNode 结构
 *
 * @important 基础算法，慎重修改
 */
export const parseObjToTreeNode = (srcObj: ParseObjToTreeNodeSchema) => {
  const res: ParseObjToTreeNodeReturnSchema[] = [];

  /**
   * 需要切断 srcObj 的所有成员属性的原型链
   */
  const srcCloneObj = mergeDeep({}, srcObj);

  Object.keys(srcCloneObj).map((colID) => {
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

// console.log(parseObjToTreeNode(exp));
