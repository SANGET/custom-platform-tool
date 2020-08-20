/**
 * 搜索规则的数据表 TODO: 留个坑
 */
export interface SearchingTableMapping {
  type: "searching";
  rule: string;
}

export interface GeneralTableColumn {
  field: string;
  /** TODO: 这里对应数据表的 column type */
  type: string;
  len: number;
}

/**
 * 通用的数据表
 */
export interface GeneralTableMapping {
  type: "general";
  database?: string;
  tableName: string;
  columns: {
    [uuid: string]: GeneralTableColumn;
  };
}

// TODO: 商讨一下。是否这样。强引用主从表。弱引用
// TODO: 经过商讨,关系目前的作用不大,如果要用上,逻辑太复杂牵扯太多
export interface QuoteRef {
  connectKey: string; // tableId.filed
  key?: string; // tableId.id
  value?: string; // tableId.show
}

/**
 * 数据源关系
 */
export interface DataSourceRelation {
  [dataSourceId: string]: {
    type: string;
    quoteRef?: {
      // tableId.filed。 Object扩展预留
      [dataUUID: string]: string | QuoteRef;
    };
  };
}

export interface MetadataMappingCollection {
  dataSource: {
    [ID: string]: GeneralTableMapping;
  };
  dataSourceRelation?: DataSourceRelation;
}

export default MetadataMappingCollection;
