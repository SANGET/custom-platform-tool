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

/**
 * 数据源关系
 */
interface DataSourceRelation {
  [dataSourceId: string]: {
    type: string;
    subTable?: string;
    parentTable?: string;
  }
}

interface MetadataMappingCollection {
  dataSource: {
    [ID: string]: GeneralTableMapping;
  };
  dataSourceRelation?: DataSourceRelation;
}

export default MetadataMappingCollection;
