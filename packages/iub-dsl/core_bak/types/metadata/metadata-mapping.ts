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
  type: "general";
  database?: string;
  tableName: string;
  columns: GeneralTableColumn[];
}

/**
 * 搜索规则的数据表
 */
interface SearchingTableMapping {
  type: "searching";
  rule: string;
}

/**
 * 字段映射
 */
interface Mapping {
  type: "uuid2field";
  mapping: {
    [componentBindFieldUUID: string]: string;
  };
}

interface MetadataMapping {
  mapping: Mapping;
  dataSource: {
    [ID: string]: GeneralTableMapping | SearchingTableMapping;
  };
}

export default MetadataMapping;
