import React, { useEffect, useReducer } from 'react';

import {
  Form
} from 'antd';
import { getTableInfo, updateTableInfo } from './api';
import { openNotification, infoReducer, getUrlSearchParams } from './service';
import {
  NOTIFICATION_TYPE, API_ERROR_MSG, API_SUCESS_CODE, TABLE_TYPE
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
    relationTables: relatedPages, species
  } = result || {};
  const mainTableName = auxTable?.parentTable?.name;
  const mainTableCode = auxTable?.parentTable?.code;
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
    foreignKeys,
    species,
    mainTableCode
  };
};
const canFormSave = async (form) => {
  try {
    await form.validateFields();
    return true;
  } catch (e) {
    return false;
  }
};
const getFormData = (form) => {
  return form.getFieldsValue([
    'name', 'code', 'type', 'moduleId', 'mainTableName', 'maxLevel'
  ]);
};
const getListData = (info) => {
  const {
    columns, references, foreignKeys, tableId, species, mainTableCode
  } = info;
  return {
    columns, references, foreignKeys, tableId, species, mainTableCode
  };
};
const getExtraTableConfigByType = (type, maxLevel, mainTableCode) => {
  if (type === TABLE_TYPE.TREE) {
    return { treeTable: { maxLevel } };
  }
  if (type === TABLE_TYPE.AUX_TABLE) {
    return { auxTable: { mainTableCode } };
  }
  return {};
};
const construcColumnsForSave = (columns) => {
  return columns.map((item) => {
    const {
      id, name, code, fieldType, dataType, fieldSize, decimalSize, required, unique, pinyinConvert, regular, dictionaryForeign, species
    } = item;
    const fieldProperty = {
      required, unique, pinyinConvent: pinyinConvert, regular
    };
    const dictionaryForeignTmpl = dictionaryForeign ? { dictionaryForeign: { refTableCode: dictionaryForeign, refFieldCode: 'code', refDisplayFieldCode: 'name' } } : {};
    return {
      id, name, code, fieldType, dataType, fieldSize, decimalSize, species, fieldProperty, ...dictionaryForeignTmpl
    };
  });
};
const constructReferences = (references) => {
  return references.map((item, index) => {
    const {
      id, fieldCode, refTableCode, refFieldCode, refDisplayFieldCode, sequence
    } = item;
    return {
      id, fieldCode, refTableCode, refFieldCode, refDisplayFieldCode, sequence: sequence || index
    };
  });
};
const constructForeignKeys = (foreignKeys) => {
  return foreignKeys.map((item, index) => {
    const {
      id, fieldCode, refTableCode, refFieldCode, refDisplayFieldCode, sequence, deleteStrategy, updateStrategy
    } = item;
    return {
      id, fieldCode, refTableCode, refFieldCode, refDisplayFieldCode, sequence: sequence || index, deleteStrategy, updateStrategy
    };
  });
};
const getUpdateParam = (form, info) => {
  /** 头部表单数据 */
  const {
    name, code, type, moduleId, maxLevel
  } = getFormData(form);
  /** tabs 布局中栏数据 */
  const {
    columns, references, foreignKeys, tableId, mainTableCode, species
  } = getListData(info);
  const extraConfig = getExtraTableConfigByType(type, maxLevel, mainTableCode);
  return {
    name,
    code,
    type,
    moduleId,
    id: tableId,
    columns: construcColumnsForSave(columns),
    references: constructReferences(references),
    foreignKeys: constructForeignKeys(foreignKeys),
    species,
    ...extraConfig
  };
};
const updateTable = (param) => {
  updateTableInfo(param).then((res) => {
    const type = res?.code === API_SUCESS_CODE.GETTABLEINFO
      ? NOTIFICATION_TYPE.SUCCESS : NOTIFICATION_TYPE.ERROR;
    openNotification(type, res?.msg || API_ERROR_MSG?.GETTABLEINFO);
  });
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
    tableId: '',
    /** 分类 */
    species: '',
    /** tab中的编辑中的行唯一标识 */
    editingKey: '',
    /** 主表编码 */
    mainTableCode: ''
  });
  /** 进行数据存储 */
  const storeInfo = (dataTmpl: ITableInfo): void => {
    const {
      name, code, type, moduleId, mainTableName, mainTableCode,
      relatedPages, columns, references, foreignKeys, tableId, species
    } = dataTmpl;
    dispatchInfo({
      type: 'changeInfo',
      name: {
        relatedPages, columns, references, foreignKeys, tableId, mainTableCode, species
      }
    });
    form.setFieldsValue({
      name, code, type, moduleId, mainTableName
    });
  };
  /** 初始化时进行数据存储 */
  useEffect(() => {
    const id = getUrlSearchParams({
      target: 'id',
      fromBase64: true
    });
    getTableInfo(id)?.then((res):void => {
      /** 接口有误则返回提示 */
      if (res?.code !== API_SUCESS_CODE.GETTABLEINFO) {
        openNotification(NOTIFICATION_TYPE.ERROR, res?.msg || API_ERROR_MSG?.GETTABLEINFO);
        return;
      }
      /** 进行数据转换 */
      const dataTmpl = construcInfo(res?.result);
      /** 跟新数据 */
      storeInfo(dataTmpl);
      console.log(form.getFieldsValue(['moduleId', 'mainTableName']));
    });
  }, []);
  /**
   * 保存整表配置
   */
  const handleSave = () => {
    canFormSave(form).then((canISave) => {
      if (!canISave) return;
      const { editingKey } = info;
      if (editingKey !== '') return;
      const param = getUpdateParam(form, info);
      updateTable(param);
    });
  };
  return (
    <>
      <SaveOrCancel canISave={info.editingKey === ''} handleSave={handleSave} />
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
