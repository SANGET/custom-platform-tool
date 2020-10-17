import React, { useState, useEffect } from 'react';
import { Form, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import {
  REFERENCES_KEY, NOTIFICATION_TYPE, API_ERROR_MSG
} from '../constant';

import {
  queryTablesList
} from '../service';

import { IEditableRecord, ISELECTSMENU } from '../interface';

interface ITable {
  code: string
  name: string
  id: string
}

export const translateRefTablesToSelectMenus = (tables:ITable[]): ISELECTSMENU[] => {
  if (!Array.isArray(tables)) return [];
  return tables.map((item) => {
    return {
      // key: item?.id,
      // value: item?.code,
      // label: item?.name
      key: item?.id,
      value: item?.id,
      label: item?.name

    };
  });
};

interface IProps {
  text: string
  form: FormInstance
  label?: string
}
export const PopupWindowTable: React.FC<IProps> = (props: IProps) => {
  const {
    form, text, label
  } = props;
  const [options, setOptions] = useState<ISELECTSMENU[]>([]);
  useEffect(() => {
    queryTablesList().then((res) => {
      /** 如果接口没有提供提示信息 */
      setOptions(translateRefTablesToSelectMenus(res?.result?.data));
    });
  }, []);
  const getTableIdByTableCode = (code) => {
    if (!code && !Array.isArray(options)) return '';
    return options.filter((item) => item.value === code)?.[0]?.key || '';
  };
  /**
   * 更改表时，需要同步更新下拉框数据
   * @param value
   */
  const handleChange = (value) => {
    form.setFieldsValue({
      datasource: value,
      datasourceKey: getTableIdByTableCode(value)
    });
  };
  return (
    <Form.Item
      name={text}
      label = {label}
      rules={[
        { required: true, message: '必填' },
      ]}
    >
      <Select
        showSearch
        onClick = {(e) => e.stopPropagation()}
        onBlur = {(e) => e.stopPropagation()}
        options = {options}
        onChange = {handleChange}
      />
    </Form.Item>
  );
};
export default React.memo(PopupWindowTable);
