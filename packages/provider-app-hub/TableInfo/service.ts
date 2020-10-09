import { notification, Modal } from 'antd';
import { getUrlSearchParams } from "@mini-code/request/url-resolve";
import { construct as contructTree } from '@infra/utils/tools';
import {
  IStatus, ISELECTSMENU, ITableColumn, IRef, FormInstance, ITableColumnFromApi
} from './interface';
import { DATATYPESTR, FIELDCODE } from './constant';
import { FIELDTYPE } from './components/columnsManager/constant';

export { getUrlSearchParams, contructTree };
const { confirm } = Modal;
/** 通用的页面提示方法 */
export function openNotification(type: IStatus, msg = "", description = "") {
  notification?.[type]?.({
    message: msg,
    description
  });
}

/** 根据下拉项数据和当前值获取显示数据 */
export const getlabelByMenue = (menu: ISELECTSMENU[], key?: string): string => {
  return key ? (menu?.filter((item) => item?.key === key)?.[0]?.label || '') : '';
};

/** 判断是否为用户当次创建的记录 */
export const isRecordCustomed = (record) => {
  return !!record?.createdCustomed;
};
/** 更改 tableInfo 的 dispatch */
export const infoReducer = (state, action) => {
  switch (action?.type) {
    case 'changeInfo':
      return {
        ...state,
        ...action?.name
      };
    case 'editColumns':
      const { columns } = state;
      const columnsTmpl = JSON?.parse(JSON?.stringify(columns));
      for (const key in action?.name) {
        columnsTmpl[key] = { ...columns?.[key], ...action?.name?.[key] };
      }
      return {
        ...state,
        columns: columnsTmpl
      };
    case 'unShiftColumn':
      return {
        ...state,
        columns: [action?.name, ...state?.columns]
      };
    case 'deleteColumnsById':
      return {
        ...state,
        columns: state?.columns?.filter((item) => item?.id !== action?.name)
      };
    case 'editReferences':
      const { references } = state || {};
      const referencesTmpl = JSON?.parse(JSON?.stringify(references));
      for (const key in action?.name) {
        referencesTmpl[key] = { ...references?.[key], ...action?.name?.[key] };
      }
      return {
        ...state,
        references: referencesTmpl
      };
    case 'unShiftReference':
      return {
        ...state,
        references: [action?.name, ...state?.references]
      };
    case 'deleteReferencesById':
      return {
        ...state,
        references: state?.references?.filter((item) => item?.id !== action?.name)
      };
    case 'editForeignKeys':
      const { foreignKeys } = state || {};
      const foreignKeysTmpl = JSON?.parse(JSON?.stringify(foreignKeys));
      for (const key in action?.name) {
        foreignKeysTmpl[key] = { ...foreignKeys?.[key], ...action?.name?.[key] };
      }
      return {
        ...state,
        foreignKeys: foreignKeysTmpl
      };
    case 'unShiftForeignKey':
      return {
        ...state,
        foreignKeys: [action?.name, ...state?.foreignKeys]
      };
    case 'deleteForeignKeysById':
      return {
        ...state,
        foreignKeys: state?.foreignKeys?.filter((item) => item?.id !== action?.name)
      };
  }
  return {};
};

interface IRecord {
  editable?: boolean
  id: string
}
/**
 * 根据 记录唯一标识 获取记录在列表中的索引
 *
 * @param editingKey {string} 记录唯一标识
 * @param record {IRecord[]} 记录列表
 * @return index {number} 索引
 */
export const getIndexByEditingKey = (editingKey: string, records: IRecord[]):number => {
  let index = -1;
  Array.isArray(records) && records.some((item, i) => {
    if (item?.id === editingKey) {
      index = i;
      return true;
    }
    return false;
  });
  return index;
};

/**
 * 获取正在编辑的记录唯一标识集合
 *
 * @param records {IRecord[]} 记录列表
 * @returns arr {number[]} 索引列表
 */
export const getRowKeysEditable = (records: IRecord[]) => {
  if (!Array.isArray(records)) return [];
  return records.reduce((arr: string[], item) => {
    if (item?.editable) arr.push(item?.id);
    return arr;
  }, []);
};

interface IDeleteConfirmParam {
  title?: string
  okText?: string
  cancelText?: string
  onOk?: ()=>void
  onCancel?: ()=>void
}

/**
 * 删除询问框
 *
 * @param {string} title 询问框标题
 * @param {string} okText 确定按钮名称
 * @param {string} cancelText 取消按钮名称
 * @param {function} onOk 点确定按钮执行的操作
 * @param {function} onCancel 点取消按钮执行的操作
 * @returns {void}
 */
export const deleteConfirm = (param: IDeleteConfirmParam): void => {
  const {
    title = '是否确定删除？', cancelText = '取消', okText = '确定', onOk, onCancel
  } = param || {};
  confirm({
    title,
    cancelText,
    okText,
    onOk() {
      typeof onOk === 'function' && onOk();
    },
    onCancel() {
      typeof onCancel === 'function' && onCancel();
    },
  });
};

export const translateColumnsToOptions = (
  columns: ITableColumn[], dataType: string
):ISELECTSMENU[] => {
  const arr = Array.isArray(columns) ? columns
    .filter((item) => item?.[DATATYPESTR] === dataType)
    .map((item) => {
      return {
        label: item?.name,
        value: item?.code,
        key: item?.code
      };
    }) : [];
  return arr;
};
/**
 * 下拉项的数据需要去除已经被使用的数据项
 * @param options
 * @param references
 * @param form
 */
export const filterOptionsForChoose = (
  options: ISELECTSMENU[], references: IRef[], form: FormInstance
): ISELECTSMENU[] => {
  const referencesValue = Array.isArray(references)
    ? references.map((item) => item?.fieldCode) : [];
  const fieldCode = form.getFieldValue(FIELDCODE);
  const arr = Array.isArray(options)
    ? options.filter((item) => {
      return fieldCode === item?.value || !referencesValue?.includes(item?.value);
    })
    : [];
  return arr;
};

interface ITable {
  code: string
  name: string
  id: string
}
/**
 * 更改表列表为 下拉框组件支持的数据格式
 * @param tables 表列表
 * @returns selectMenu 下拉框列表
 */
export const translateRefTablesToSelectMenus = (tables:ITable[]): ISELECTSMENU[] => {
  if (!Array.isArray(tables)) return [];
  return tables.map((item) => {
    return {
      key: item?.id,
      value: item?.code,
      label: item?.name
    };
  });
};

/**
 * 更改字段列表为 下拉框组件支持的数据格式
 * @param fields 字段列表
 * @returns selectMenu 下拉框列表
 */
export const translateRefFieldsToSelectMenus = (fields: ITableColumnFromApi[]):ISELECTSMENU[] => {
  if (!Array.isArray(fields)) return [];
  return fields
    .filter((item) => item.fieldType !== FIELDTYPE.TEXT)
    .map((item) => {
      return {
        key: item?.code,
        value: item?.code,
        label: item?.name
      };
    });
};
