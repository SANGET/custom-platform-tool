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
