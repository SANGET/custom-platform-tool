import React, { useState } from 'react';
import { TypeOfIUBDSL } from "@iub-dsl/definition";
import { ColumnItem, DatasourceItem } from '@provider-app/page-designer/types';
import { TABLE_PATH_SPLIT_MARK } from './const';
// import { dependencyInspect } from "..";

export interface TableInfo {
  /** 该条记录的 id */
  id: string
  /** 该条记录关联的表的 id */
  moduleId: string
  /** 名字 */
  name: string
  /** 类型 */
  type: string
  /** columns-mark */
  columns: string[]
}

interface ParseMetaDataCtx {
  baseMark: string
}

const parseColumn = (column: ColumnItem) => {
  return column;
};

const parseColumns = (c: ColumnItem[], ctx: ParseMetaDataCtx) => {
  /** TODO: 还没统一先做兼容处理 */
  let columns;
  if (!Array.isArray(c)) {
    if (typeof c === 'object') {
      columns = Object.values(c) as any;
    } else {
      columns = [];
    }
  } else {
    columns = c;
  }

  const { baseMark } = ctx;

  const columnsIdMarks: string[] = [];
  let columnsList: { [mark: string]: ColumnItem } = {};

  let mark = '';

  for (let i = 0; i < columns.length; i++) {
    const columnInfo = columns[i];
    mark = baseMark + columnInfo.id;

    columnsIdMarks.push(mark);
    columnsList = {
      ...columnsList,
      [mark]: parseColumn(columnInfo)
    };
  }
  return {
    columnsIdMarks,
    columnsList
  };
};

export interface MetaDateParseRes {
  allColumnsList: { [mark: string]: ColumnItem };
  allColumnsIdMarks: string[]
  tableList: { [tableId: string]: TableInfo }
}

const initialMetaDataParseRes = (): MetaDateParseRes => ({
  allColumnsList: {},
  tableList: {},
  allColumnsIdMarks: []
});

export const parseMetaData = (datasources: DatasourceItem[]) => {
  const tableIds: string[] = [];
  const metaDateParseRes = initialMetaDataParseRes();
  const { allColumnsIdMarks, allColumnsList, tableList } = metaDateParseRes;

  let baseMark = '';
  for (let i = 0; i < datasources.length; i++) {
    const tableInfo = datasources[i];
    tableIds.push(tableInfo.id);
    baseMark = tableInfo.id + TABLE_PATH_SPLIT_MARK;
    /** 列解析 */
    const { columnsIdMarks, columnsList } = parseColumns(tableInfo.columns, { baseMark });
    /** 添加表格信息 */
    tableList[tableInfo.id] = {
      ...tableInfo,
      columns: columnsIdMarks
    };

    /** 添加allColumnsIdMarks信息 */
    allColumnsIdMarks.push(...columnsIdMarks);

    /** 添加columns信息 */
    Object.assign(allColumnsList, columnsList);
  }
  return metaDateParseRes;
};
