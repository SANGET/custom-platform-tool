import { columnEditConfig } from './columnsConfig';
import { ITableColumn, ITableColumnShowKey, FormInstance } from '../../interface';
import {
  getlabelByMenue, isRecordCustomed, getIndexByEditingKey,
  openNotification, getRowKeysEditable, deleteConfirm
} from '../../service';

export { getlabelByMenue, isRecordCustomed };
/** 判断控件是否可编辑 */
const canColumnEdit = (
  record: ITableColumn, formTmpl: FormInstance, dataIndex: ITableColumnShowKey
): boolean => {
  const canRowEdit = record?.editable;
  if (!canRowEdit) return false;
  /** 字段名称和字段编码恒可编辑 */
  return columnEditConfig?.[dataIndex]?.(formTmpl, record) || false;
};
interface IRecord {
  id: string
}

const columnReducer = (state, action) => {
  switch (action?.type) {
    case 'changeEditingKey':
      return { ...state, editingKey: action?.name };
    case 'pushSelectedRowKey':
      let selectedRowKeys = [action?.name];
      if (state?.selectedRowKeys?.includes(action?.name)) {
        selectedRowKeys = [];
      }
      return { ...state, selectedRowKeys };
    case 'allIn':
      return { ...state, ...action?.name };
    case 'setVisibleChooseDictModal':
      return { ...state, visibleChooseDictModal: action?.name || false };
    case 'setVisibleCreateReferenceModal':
      return { ...state, visibleCreateReferenceModal: action?.name || false };
    case 'setVisibleCreateForeignKeyModal':
      return { ...state, visibleCreateForeignKeyModal: action?.name || false };
    case 'changeShowSysSpecies':
      return { ...state, showSYSSpecies: action?.name };
  }
};
export {
  canColumnEdit, columnReducer, getIndexByEditingKey,
  openNotification, getRowKeysEditable, deleteConfirm
};
