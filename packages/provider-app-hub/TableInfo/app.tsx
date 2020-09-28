import React, { useEffect, useReducer } from 'react';

import {
  Form
} from 'antd';
import { getTableInfo } from './api';
import { openNotification, infoReducer, getUrlParams } from './service';
import {
  NOTIFICATION_TYPE, API_ERROR_MSG, API_SUCESS_CODE
} from './constant';
import {
  InfoForm, SaveOrCancel, RelatedPageTags, ManagerTabs
} from "./components";
import "./index.less";
import {
  ITableInfoFromApi, ITableInfo, ITableColumn, ITableColumnFromApi
} from './interface';

/** 转换表字段信息数据 */
const construcColumns = (columns: ITableColumnFromApi[]): ITableColumn[] => {
  return columns.map((column) => {
    const { dictionaryForeign, fieldProperty, ...rest } = column || {};
    return Object.assign({}, rest, {
      dictionaryForeign: dictionaryForeign?.id,
      dictionaryForeignCn: dictionaryForeign?.tableName,
      required: fieldProperty?.required || false,
      unique: fieldProperty?.unique || false,
      pinyinConvert: fieldProperty?.pinyinConvent || false
    });
  });
};
  /** 对接口返回的数据进行转化 */
const construcInfo = (result: ITableInfoFromApi): ITableInfo => {
  const {
    name, code, type, moduleId, auxTable, columns, references, foreignKeys, id,
    relationTables: relatedPages
  } = result || {};
  const mainTableName = auxTable?.parentTable?.name;
  return {
    tableId: id,
    name,
    code,
    type,
    moduleId,
    mainTableName,
    relatedPages,
    columns: construcColumns(columns),
    references,
    foreignKeys
  };
};
interface IProps {

}

const TableInfo : React.FC<IProps> = (props: IProps) => {
  /** 表信息：表名，表编码，表类型，归属模块，主表名称 */
  const [form] = Form.useForm();
  const [info, dispatchInfo] = useReducer(infoReducer, {
    /** 表字段管理的列表数据 */
    columns: [],
    /** 表字段管理的校验结果 */
    columnsValid: true,
    /** 关联页面的列表数据 */
    relatedPages: [],
    /** 引用管理的列表数据 */
    references: [],
    /** 引用管理的校验结果 */
    referencesValid: true,
    /** 外键管理的列表数据 */
    foreignKeys: [],
    /** 外键管理的校验结果 */
    foreignKeysValid: true,
    /** 表id */
    tableId: ''
  });
  /** 进行数据存储 */
  const storeInfo = (dataTmpl: ITableInfo): void => {
    const {
      name, code, type, moduleId, mainTableName,
      relatedPages, columns, references, foreignKeys, tableId
    } = dataTmpl;
    dispatchInfo({
      type: 'changeInfo',
      name: {
        relatedPages, columns, references, foreignKeys, tableId
      }
    });
    form?.setFieldsValue({
      name, code, type, moduleId, mainTableName
    });
  };
  /** 初始化时进行数据存储 */
  useEffect(() => {
    const id = getUrlParams('id', undefined, true);
    getTableInfo(id)?.then((res):void => {
      /** 接口有误则返回提示 */
      if (res?.code !== API_SUCESS_CODE?.GETTABLEINFO) {
        openNotification(NOTIFICATION_TYPE?.ERROR, res?.msg || API_ERROR_MSG?.GETTABLEINFO);
        return;
      }
      /** 进行数据转换 */
      const dataTmpl = construcInfo(res?.result);
      /** 跟新数据 */
      storeInfo(dataTmpl);
    });
  }, []);
  return (
    <>
      <SaveOrCancel />
      <InfoForm
        form={form}
      />
      <RelatedPageTags
        relatedPages={info?.relatedPages}
      />
      <ManagerTabs
        tableId = { info?.tableId}
        columns={ info?.columns }
        columnsValid = { info?.columnsValid }
        dispatchInfo = { dispatchInfo }
        references = { info?.references }
        referencesValid = { info?.referencesValid }
        foreignKeys = { info?.foreignKeys }
        foreignKeysValid = { info?.foreignKeysValid }
      />
    </>
  );
};

export default TableInfo;
