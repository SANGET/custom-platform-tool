import { DatasourceItem } from '@provider-app/page-designer/types';
import { MetaDateParseRes, TableInfo, parseMetaData } from "./datasource-meta-parser";
import { isPageDatasoruceMeta, pickDatasoruceMetaKeyWord } from ".";

export const createMetadataStore = (parseRes: MetaDateParseRes) => {
  const { tableList, allColumnsList, allColumnsIdMarks } = parseRes;

  const getTable = (tableMark: string) => {
    if (isPageDatasoruceMeta(tableMark)) {
      tableMark = pickDatasoruceMetaKeyWord(tableMark);
    } else {
      return tableMark;
    }
    const table = tableList[tableMark];
    // console.log(table);
    return table.name;
    // return table.id
  };

  /** 获取某个filedMark的fieldCode */
  const getFiledCode = (filedMark: string) => {
    if (isPageDatasoruceMeta(filedMark)) {
      filedMark = pickDatasoruceMetaKeyWord(filedMark);
    } else {
      console.error('非法数据源元数据唯一标示!~~', filedMark);
      return false;
    }
    if (allColumnsIdMarks.includes(filedMark)) {
      const columnsInfo = allColumnsList[(filedMark)];
      return columnsInfo.fieldCode;
    }
    console.error('未找到数据源元数据唯一标示!~~', filedMark);
    return false;
  };

  /** 获取某个表的fieldsCode */
  const getFiledsCodeFromTable = (tableId: string) => {
    let temp: TableInfo;
    if (
      isPageDatasoruceMeta(tableId)
      && (temp = tableList[pickDatasoruceMetaKeyWord(tableId)])
    ) {
      const filedsCode = temp.columns.map(getFiledCode);
      return filedsCode;
    }
    console.error('非法表ID!');
    return false;
  };

  return {
    getTable,
    getFiledCode,
    getFiledsCodeFromTable
  };
};

export const datasourceMetaHandle = (datasources: DatasourceItem[] = []) => {
  const parseRes = parseMetaData(datasources);
  return createMetadataStore(parseRes);
};
