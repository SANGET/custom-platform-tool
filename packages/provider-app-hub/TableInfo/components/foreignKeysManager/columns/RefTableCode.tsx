import React, { useState, useEffect } from 'react';
import { Form, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import {
  FOREIGNKEYS_KEY, NOTIFICATION_TYPE, API_ERROR_MSG
} from '../constant';

import {
  canColumnEdit, openNotification, translateRefTablesToSelectMenus
} from '../service';
import { queryTablesList } from '../../../api';
import RenderText from '../../RenderText';

import { IForeignKey, ISELECTSMENU } from '../../../interface';

interface IProps {
  text: string
  record: IForeignKey
  form: FormInstance
}
export const RefTableCode: React.FC<IProps> = (props: IProps) => {
  const {
    form, text, record
  } = props;
  const editable = canColumnEdit(record, form, FOREIGNKEYS_KEY?.REFTABLECODE);
  const [options, setOptions] = useState<ISELECTSMENU[]>([]);
  useEffect(() => {
    if (editable) {
      queryTablesList().then((res) => {
        /** 如果接口没有提供提示信息 */
        if (!res?.msg) {
          openNotification(NOTIFICATION_TYPE.ERROR, API_ERROR_MSG.ALLOWDELETE);
          return;
        }
        setOptions(translateRefTablesToSelectMenus(res?.result?.data));
      });
    }
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
      [FOREIGNKEYS_KEY?.REFFIELDCODE]: '',
      [FOREIGNKEYS_KEY?.REFDISPLAYCODE]: '',
      [FOREIGNKEYS_KEY?.REFTABLEID]: getTableIdByTableCode(value)
    });
  };
  return editable ? (
    <Form.Item
      name={FOREIGNKEYS_KEY?.REFTABLECODE}
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
  ) : (
    <RenderText text={text}/>
  );
};
export default React.memo(RefTableCode);
