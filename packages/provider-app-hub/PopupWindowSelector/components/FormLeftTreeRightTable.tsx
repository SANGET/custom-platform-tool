/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Form } from 'antd';
import { FormInstance } from 'antd/lib/form';
import {
  IEditPopupWindowProps,
  NOTIFICATION_TYPE, API_ERROR_MSG, COLUMNS_KEY, FIELDTYPE
} from '../constant';
import './index.less';
import CreateModal from './CreateModal';
import { PopupWindowTable } from './PopupWindowTable';
import { PopupWindowField } from './PopupWindowField';
import {
  queryTablesList,
  openNotification, getTableInfo
} from '../service';
import {
  ISELECTSMENU, IPopupWindowShowKey, ITableColumn, ITableColumnFromApi
} from '../interface';

export const translatePopupWindowTablesToSelectMenus = (tables:ITable[]): ISELECTSMENU[] => {
  if (!Array.isArray(tables)) return [];
  return tables.map((item) => {
    return {
      key: item?.id,
      value: item?.id,
      label: item?.name

    };
  });
};

export const translateRefFieldsToSelectMenus = (fields: ITableColumnFromApi[]):ISELECTSMENU[] => {
  if (!Array.isArray(fields)) return [];
  return fields
    // .filter((item) => item.fieldType !== FIELDTYPE.TEXT)
    .map((item) => {
      return {
        key: item?.id,
        value: item?.id,
        label: item?.name
      };
    });
};

const FormTreePopupWindow: React.FC<IEditPopupWindowProps> = (props: IEditPopupWindowProps) => {
  const {
    form,
    editData: {
      id, name, selectType, showType, treeTablePopupWindowDetail: {
        treeDatasource, treeDatasourceType, treeReturnText, treeReturnValue, treeSortInfo, treeShowColumn, treeSuperiorColumn,
        treeRelatedSuperiorColumn,
        tableDatasource, tableDatasourceType, tableReturnText, tableReturnValue, tableShowColumn, tableSortInfo, tableTreeRelatedColumn

      }
    }
  } = props;
  const [datasourceOptions, setDatasourceOptions] = useState<ISELECTSMENU[]>([]);
  const [fieldOptionsForTree, setFieldOptionsForTree] = useState<ISELECTSMENU[]>([]);
  const [fieldOptionsForTable, setFieldOptionsForTable] = useState<ISELECTSMENU[]>([]);

  const [tableIdForTree, setTableIdForTree] = useState(treeDatasource);
  const [tableIdForTable, setTableIdForTable] = useState(tableDatasource);

  const handleTableChangeForTable = () => {
    setTableIdForTable(form?.getFieldValue(['tableDatasource']));
  };
  const handleTableChangeForTree = () => {
    setTableIdForTree(form?.getFieldValue(['treeDatasource']));
  };

  const getFieldDataForTree = (dtsTableId) => {
    if (!dtsTableId) {
      setFieldOptionsForTree([]);
      return;
    }
    getTableInfo(dtsTableId).then((res) => {
    /** 如果接口没有提供提示信息 */
      if (!res?.msg) {
        openNotification(NOTIFICATION_TYPE?.ERROR, API_ERROR_MSG?.ALLOWDELETE);
        return;
      }
      const fieldSelectOptions = translateRefFieldsToSelectMenus(res?.result?.columns);
      setFieldOptionsForTree(fieldSelectOptions);
    });
  };
  const getFieldDataForTable = (dtsTableId) => {
    if (!dtsTableId) {
      setFieldOptionsForTable([]);
      return;
    }
    getTableInfo(dtsTableId).then((res) => {
    /** 如果接口没有提供提示信息 */
      if (!res?.msg) {
        openNotification(NOTIFICATION_TYPE?.ERROR, API_ERROR_MSG?.ALLOWDELETE);
        return;
      }
      const fieldSelectOptions = translateRefFieldsToSelectMenus(res?.result?.columns);
      setFieldOptionsForTable(fieldSelectOptions);
    });
  };

  useEffect(() => {
    queryTablesList().then((res) => {
      /** 如果接口没有提供提示信息 */
      setDatasourceOptions(translatePopupWindowTablesToSelectMenus(res?.result?.data));
    });
  }, []);
  useEffect(() => {
    getFieldDataForTree(tableIdForTree);
  }, [tableIdForTree]);
  useEffect(() => {
    getFieldDataForTable(tableIdForTable);
  }, [tableIdForTable]);

  return (
    <>
      <PopupWindowTable
        {...props}
        options = {datasourceOptions}
        selectedValue = {treeDatasource}
        form={form}
        label="树形数据源"
        name = 'treeDatasource'
        text = 'treeDatasource'
        onTableChange = {handleTableChangeForTree}
      />
      <PopupWindowField
        {...props}
        options = {fieldOptionsForTree}
        selectedValue = {treeReturnValue}
        label = "树形返回值"
        form={form}
        name="treeReturnValue"

      />
      <PopupWindowField
        {...props}
        options = {fieldOptionsForTree}
        selectedValue = {treeReturnText}
        label = "树形返回文本"
        form={form}
        name="treeReturnText"
      />
      <PopupWindowField
        {...props}
        options = {fieldOptionsForTree}
        selectedValue = {treeSortInfo}
        label = "树形排序字段"
        form={form}
        name="treeSortInfo"
      />
      <PopupWindowField
        {...props}
        options = {fieldOptionsForTree}
        selectedValue = {treeShowColumn}
        label = "树形显示字段"
        form={form}
        name="treeShowColumn"
      />
      <PopupWindowField
        {...props}
        options = {fieldOptionsForTree}
        selectedValue = {treeSuperiorColumn}
        label = "树形上级字段"
        form={form}
        name="treeSuperiorColumn"
      />
      <PopupWindowField
        {...props}
        options = {fieldOptionsForTree}
        selectedValue = {treeRelatedSuperiorColumn}
        label = "树形上级字段"
        form={form}
        name="treeRelatedSuperiorColumn"
      />

      <PopupWindowTable
        {...props}
        options = {datasourceOptions}
        selectedValue = {tableDatasource}
        form={form}
        label="数据源"
        name = 'tableDatasource'
        text = 'tableDatasource'
        onTableChange = {handleTableChangeForTable}
      />
      <PopupWindowField
        {...props}
        options = {fieldOptionsForTable}
        selectedValue = {tableReturnValue}
        label = "返回值"
        form={form}
        name="tableReturnValue"

      />
      <PopupWindowField
        {...props}
        options = {fieldOptionsForTable}
        selectedValue = {tableReturnText}
        label = "返回文本"
        form={form}
        name="tableReturnText"
      />
      <PopupWindowField
        {...props}
        options = {fieldOptionsForTable}
        selectedValue = {tableSortInfo}
        label = "排序字段"
        form={form}
        name="tableSortInfo"
      />
      <PopupWindowField
        {...props}
        options = {fieldOptionsForTable}
        selectedValue = {tableShowColumn}
        label = "显示字段"
        form={form}
        name="tableShowColumn"
      />

    </>
  );
};
export default React.memo(FormTreePopupWindow);
