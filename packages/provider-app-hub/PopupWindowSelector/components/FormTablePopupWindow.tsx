/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Form } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { IEditPopupWindowProps } from '../constant';
import './index.less';
import CreateModal from './CreateModal';
import { PopupWindowTable } from './PopupWindowTable';
import { PopupWindowField } from './PopupWindowField';
import {
  queryTablesList
} from '../service';
import { ISELECTSMENU } from '../interface';

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

const FormTablePopupWindow: React.FC<IEditPopupWindowProps> = (props: IEditPopupWindowProps) => {
  const {
    form,
    editData: {
      id, name, selectType, showType, tablePopupWindowDetail: {
        datasource, datasourceType, returnText, returnValue
      }
    }
  } = props;
  const [datasourceOptions, setDatasourceOptions] = useState<ISELECTSMENU[]>([]);
  const [returnValueOptions, setReturnValueOptions] = useState<ISELECTSMENU[]>([]);
  const [returnTextOptions, setReturnTextOptions] = useState<ISELECTSMENU[]>([]);

  useEffect(() => {
    queryTablesList().then((res) => {
      /** 如果接口没有提供提示信息 */
      setDatasourceOptions(translatePopupWindowTablesToSelectMenus(res?.result?.data));
    });
  }, []);

  return (
    <>
      <PopupWindowTable
        {...props}
        options = {datasourceOptions}
        selectedValue = {datasource}
        form={form}
        label="数据源"
        name = 'datasource'
        code='datasource'
        text = 'datasource'
      />
      <PopupWindowField
        {...props}
        options = {returnValueOptions}
        selectedValue = {returnValue}
        label = "返回值"
        code='returnValue'
        form={form}
        name="returnValue"
        tableId = {datasource}

      />
      <PopupWindowField
        {...props}
        options = {returnTextOptions}
        label = "返回文本"
        code='returnText'
        form={form}
        name="returnText"
        tableId = {datasource}
      />
      <PopupWindowField
        {...props}
        options = {datasourceOptions}
        label = "排序字段"
        code='sortColumnInfo'
        form={form}
        name="sortColumnInfo"
        tableId = {datasource}
      />
      <PopupWindowField
        {...props}
        options = {datasourceOptions}
        label = "显示字段"
        code='showColumn'
        form={form}
        name="showColumn"
        tableId = {datasource}
      />
    </>
  );
};
export default React.memo(FormTablePopupWindow);
