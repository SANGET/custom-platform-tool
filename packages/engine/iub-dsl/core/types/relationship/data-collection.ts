interface groupItem {
  schemasMapping: string;
  collectionCondition?: string; // 应该也是个表达式?
  // TODO:: 是否递归成组、组合、.;个人认为不要,dataSource可以有结构,这边又有结构,增加了不可控性.  JGC 20/07/06
}

interface BaseCollectionOptiosion {
  isCheckGroup: boolean; // 是否成组验证. 用于整个提交的时候整组验证
}

type BaseStruct = string | {
  [str: string]: BaseStruct
} | BaseStruct[]

interface ColletionObjectStruct extends BaseCollectionOptiosion {
  type: 'objectStruct',
  struct: BaseStruct[]
}

type CollectionType = ColletionObjectStruct

export interface DataCollectionRelationship {
  [groupUUID: string]: CollectionType
}
