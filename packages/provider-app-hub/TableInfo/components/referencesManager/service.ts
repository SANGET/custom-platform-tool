import {
  getlabelByMenue, isRecordCustomed, openNotification, getRowKeysEditable, deleteConfirm,
  translateColumnsToOptions as translateColumnsToOptionsPlus, filterOptionsForChoose,
  translateRefTablesToSelectMenus, translateRefFieldsToSelectMenus
} from '../../service';
import {
  FormInstance, IReferenceShowKey, IEditableRecord
} from '../../interface';
import { DATATYPE } from './constant';
import { columnEditConfig } from './columnConfig';

/**
 * 判断数据是否处于可编辑状态
 * @param record 当前数据记录
 * @param formTmpl 记录转换而成的编辑表单数据（用于实时数据更新）
 * @param dataIndex 当前字段名
 */
export const canColumnEdit = (
  record: IEditableRecord, formTmpl: FormInstance, dataIndex: IReferenceShowKey
): boolean => {
  const canRowEdit = record?.editable;
  /** 非编辑行无需考虑 */
  if (!canRowEdit) return false;
  /** 字段名称和字段编码恒可编辑 */
  return columnEditConfig?.[dataIndex](formTmpl) || false;
};

/**
 * 引用列表中的字段名称来源，需是字段列表中数据类型为“引用”的字段
 * @param columns 字段列表数据
 */
export const translateColumnsToOptions = (columns) => {
  return translateColumnsToOptionsPlus(columns, DATATYPE.QUOTE);
};

/**
 * references 的 dispatch执行体
 * @param state 执行前数据
 * @param action 动作
 */
export const referenceReducer = (state, action) => {
  switch (action.type) {
    case 'changeEditingIndex':
      return {
        ...state,
        editingIndex: action?.name
      };
    case 'pushSelectedRowKey':
      let selectedRowKeys = action?.name ? [action?.name] : [];
      if (state.selectedRowKeys.includes(action.name)) {
        selectedRowKeys = [];
      }
      return { ...state, selectedRowKeys };
    case 'allIn':
      return { ...state, ...action?.name };
    case 'setFieldOptions':
      return { ...state, fieldOptions: action?.name };
  }
};

export {
  getlabelByMenue, isRecordCustomed, openNotification, getRowKeysEditable, deleteConfirm,
  filterOptionsForChoose, translateRefTablesToSelectMenus, translateRefFieldsToSelectMenus
};
