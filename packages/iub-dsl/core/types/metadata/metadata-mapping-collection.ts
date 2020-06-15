/**
 * 搜索规则的数据表 TODO: 留个坑
 */
interface SearchingTableMapping {
  type: 'searching';
  rule: string;
}

interface GeneralTableColumn {
  field: string;
  /** TODO: 这里对应数据表的 column type */
  type: string;
  len: number;
}

/**
 * 通用的数据表
 */
interface GeneralTableMapping {
  type: 'general';
  database?: string;
  tableName: string;
  columns: {
    [uuid: string]: GeneralTableColumn;
  };
}

// TODO: 商讨一下。是否这样。强引用主从表。弱引用
interface QuoteRef {
  connectKey: string; // tableId.filed
  key?: string; // tableId.id
  value?: string; // tableId.show
}

/**
 * 数据源关系
 */
interface DataSourceRelation {
  [dataSourceId: string]: {
    type: string;
    subTable?: string | QuoteRef;
    parentTable?: string | {
      [dataUUID: string]: QuoteRef;
    };
    quoteRef?: {
      // tableId.filed。 Object扩展预留
      [dataUUID: string]: string | QuoteRef; 
    }
  }
}

interface MetadataMappingCollection {
  dataSource: {
    [ID: string]: GeneralTableMapping;
  };
  dataSourceRelation?: DataSourceRelation;
}

export default MetadataMappingCollection;
