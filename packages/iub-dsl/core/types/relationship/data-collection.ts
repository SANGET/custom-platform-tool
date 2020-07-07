interface groupItem {
  schemasMapping: string;
  collectionCondition?: string; // 应该也是个表达式?
  // TODO:: 是否递归成组、组合、.;个人认为不要,dataSource可以有结构,这边又有结构,增加了不可控性.  JGC 20/07/06
}

export interface DataCollectionRelationship {
  [groupUUID: string]: {
    group: groupItem[],
    isCheck?: boolean; // 是否成组验证. 用于整个提交的时候整组验证
  }
}
