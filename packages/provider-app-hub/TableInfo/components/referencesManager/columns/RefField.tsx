import React, { useState } from 'react';
import { Form, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';

import { canColumnEdit, openNotification, translateRefFieldsToSelectMenus } from '../service';
import RenderText from '../../RenderText';
import { REFERENCES_KEY, NOTIFICATION_TYPE, API_ERROR_MSG } from '../constant';

import { IReference, ISELECTSMENU, IReferenceShowKey } from '../../../interface';
import { getTableInfo } from '../../../api';

interface IProps {
  text: string
  record: IReference
  form: FormInstance
  code: IReferenceShowKey
  name: string
}
export const RefField: React.FC<IProps> = (props: IProps) => {
  const {
    form, text, record, code, name
  } = props;
  const [options, setOptions] = useState<ISELECTSMENU[]>([]);
  const editable = canColumnEdit(record, form, code);
  const getMenusData = () => {
    const id = form.getFieldValue(REFERENCES_KEY?.REFTABLEID);
    !id && setOptions([]);
    getTableInfo(id).then((res) => {
    /** 如果接口没有提供提示信息 */
      if (!res?.msg) {
        return openNotification(NOTIFICATION_TYPE?.ERROR, API_ERROR_MSG?.ALLOWDELETE);
      }
      const fieldOptions = translateRefFieldsToSelectMenus(res?.result?.columns);
      setOptions(fieldOptions);
    });
  };
  const handleDropdown = (oepn:boolean) => {
    oepn && getMenusData();
  };
  return editable ? (
    <Form.Item
      name={code}
      rules={[
        { required: true, message: `${name}必填` },
      ]}
    >
      <Select
        onClick = {(e) => e.stopPropagation()}
        onBlur = {(e) => e.stopPropagation()}
        onDropdownVisibleChange={handleDropdown}
        options = {options}
      />
    </Form.Item>
  ) : (
    <RenderText text={text}/>
  );
};
export default React.memo(RefField);
