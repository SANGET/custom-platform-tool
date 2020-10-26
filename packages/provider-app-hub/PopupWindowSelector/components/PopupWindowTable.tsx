import React, { useState, useEffect } from 'react';
import { Form, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import {
  REFERENCES_KEY, NOTIFICATION_TYPE, API_ERROR_MSG, IPopupWindow
} from '../constant';

interface ITable {
  code: string
  name: string
  id: string
}

interface IProps {
  text: string
  form: FormInstance
  label?: string

  editData: IPopupWindow
  onTableChange: () => void;
}
export const PopupWindowTable: React.FC<IProps> = (props: IProps) => {
  const {
    label, name, form, options, selectedValue, onTableChange
  } = props;

  useEffect(() => {
    form.setFieldsValue({ [name]: selectedValue });
  }, []);

  // const getTableIdByTableCode = (code) => {
  //   if (!code && !Array.isArray(options)) return '';
  //   return options.filter((item) => item.value === code)?.[0]?.key || '';
  // };
  /**
   * 更改表时，需要同步更新下拉框数据
   * @param value
   */
  const handleChange = (value) => {
    onTableChange && onTableChange();

    // form.setFieldsValue({
    //   datasource: selectedValue,
    // datasourceKey: getTableIdByTableCode(value)
    // });
  };
  return (
    <Form.Item
      name={name}
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
