import { DatasourceItem } from '@provider-app/page-designer/types';
import { MetaDateParseRes, TableInfo, parseMetaData } from "./datasource-meta-parser";
import { isPageDatasoruceMeta, pickDatasoruceMetaKeyWord } from ".";

export const createMetadataStore = (parseRes: MetaDateParseRes) => {
  const { tableList, allColumnsList, allColumnsIdMarks } = parseRes;
  /** 获取某个filedMark的fieldCode */
  const getFiledCode = (filedMark: string) => {
    if (
      isPageDatasoruceMeta(filedMark)
      && allColumnsIdMarks.includes(filedMark)
    ) {
      const columnsInfo = allColumnsList[pickDatasoruceMetaKeyWord(filedMark)];
      return columnsInfo.fieldCode;
    }
    console.error('非法数据源元数据唯一标示');
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
    getFiledCode,
    getFiledsCodeFromTable
  };
};

export const datasourceMetaHandle = (datasources: DatasourceItem[] = []) => {
  const parseRes = parseMetaData(datasources);
  return createMetadataStore(parseRes);
};
