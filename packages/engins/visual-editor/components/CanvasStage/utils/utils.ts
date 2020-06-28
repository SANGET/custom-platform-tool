import { mergeDeep } from "./deepmerge";

const increaseIDFac = (idCount = 0) => () => {
  idCount += 1;
  return idCount;
};
export const increaseID = increaseIDFac(0);

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
 */
export const parseObjToTreeNode = (srcObj: ParseObjToTreeNodeSchema) => {
  const res: ParseObjToTreeNodeReturnSchema[] = [];
  const srcCloneObj = mergeDeep({}, srcObj);

  Object.keys(srcCloneObj).map((colID) => {
    const currItem = srcCloneObj[colID];
    const resObj = Object.assign(currItem, {
      id: colID,
      ...currItem
    });
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
