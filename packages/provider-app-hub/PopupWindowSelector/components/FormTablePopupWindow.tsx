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
    editData: {
      id, name, selectType, showType, tablePopupWindowDetail: { datasource, datasourceType }
    }
  } = props;
  const [options, setOptions] = useState<ISELECTSMENU[]>([]);
  const [form] = Form.useForm();
  const [datasource, setDataSource] = useState(0);
  useEffect(() => {
    queryTablesList().then((res) => {
      /** 如果接口没有提供提示信息 */
      setOptions(translatePopupWindowTablesToSelectMenus(res?.result?.data));
    });
  }, []);

  return (
    <>
      <PopupWindowTable
        {...props}
        options = {options}
        datasource = {datasource}
        form={form}
        label="数据源"
        name = 'datasource'
        code='datasource'
        text = 'datasource'
      />
      <PopupWindowField
        {...props}
        label = "返回值"
        code='returnValue'
        form={form}
        name="returnValue"
        text = 'returnValue'

      />
      <PopupWindowField
        {...props}
        label = "返回文本"
        code='returnText'
        form={form}
        name="returnText"
        text = 'returnText'
      />
      <PopupWindowField
        {...props}
        label = "排序字段"
        code='sortColumnInfo'
        form={form}
        name="sortColumnInfo"
        text = 'sortColumnInfo'
      />
      <PopupWindowField
        {...props}
        label = "显示字段"
        code='showColumn'
        form={form}
        name="showColumn"
        text = 'showColumn'
      />
    </>
  );
};
export default React.memo(FormTablePopupWindow);
