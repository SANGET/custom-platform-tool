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

const FormTablePopupWindow: React.FC<IEditPopupWindowProps> = (props: IEditPopupWindowProps) => {
  const {
    form,
    editData: {
      id, name, selectType, showType, tablePopupWindowDetail: {
        datasource, datasourceType, returnText, returnValue, sortColumnInfo, showColumn
      }
    }
  } = props;
  const [datasourceOptions, setDatasourceOptions] = useState<ISELECTSMENU[]>([]);
  const [fieldOptions, setFieldOptions] = useState<ISELECTSMENU[]>([]);
  const [tableId, setTableId] = useState(datasource);
  const handleTableChange = () => {
    setTableId(form?.getFieldValue(['datasourceForTable']));
  };
  const getFieldData = () => {
    // const id = form.getFieldValue(datasourceString);
    console.log(tableId);
    if (!tableId) {
      setFieldOptions([]);
      return;
    }
    getTableInfo(tableId).then((res) => {
    /** 如果接口没有提供提示信息 */
      if (!res?.msg) {
        openNotification(NOTIFICATION_TYPE?.ERROR, API_ERROR_MSG?.ALLOWDELETE);
        return;
      }
      // setFieldOptions(res?.result?.columns);
      const fieldSelectOptions = translateRefFieldsToSelectMenus(res?.result?.columns);
      console.log(fieldSelectOptions);
      setFieldOptions(fieldSelectOptions);
    });
  };

  useEffect(() => {
    queryTablesList().then((res) => {
      /** 如果接口没有提供提示信息 */
      setDatasourceOptions(translatePopupWindowTablesToSelectMenus(res?.result?.data));
    });
  }, []);
  useEffect(() => {
    getFieldData();
  }, [tableId]);

  return (
    <>
      <PopupWindowTable
        {...props}
        options = {datasourceOptions}
        selectedValue = {datasource}
        form={form}
        label="数据源"
        name = 'datasourceForTable'
        text = 'datasource'
        onTableChange = {handleTableChange}
      />
      <PopupWindowField
        {...props}
        options = {fieldOptions}
        selectedValue = {returnValue}
        label = "返回值"
        form={form}
        name="returnValueForTable"
        tableId = {datasource}

      />
      <PopupWindowField
        {...props}
        options = {fieldOptions}
        selectedValue = {returnText}
        label = "返回文本"
        form={form}
        name="returnTextForTable"
        tableId = {datasource}
      />
      <PopupWindowField
        {...props}
        options = {fieldOptions}
        selectedValue = {sortColumnInfo}
        label = "排序字段"
        form={form}
        name="sortColumnInfoForTable"
        tableId = {datasource}
      />
      <PopupWindowField
        {...props}
        options = {fieldOptions}
        selectedValue = {showColumn}
        label = "显示字段"
        form={form}
        name="showColumnForTable"
        tableId = {datasource}
      />
    </>
  );
};
export default React.memo(FormTablePopupWindow);
