import React from 'react';
import { Form, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import {
  FOREIGNKEYS_KEY
} from '../constant';

import { canColumnEdit, getlabelByMenue, filterOptionsForChoose } from '../service';
import RenderText from '../../RenderText';

import { IForeignKey, ISELECTSMENU } from '../../../interface';

interface IProps {
  text: string
  record: IForeignKey
  form: FormInstance
  options:ISELECTSMENU[]
  foreignKeys: IForeignKey[]
  index: number
  dispatchInfo:({ type: string, name: any })=>void
}
const FieldName: React.FC<IProps> = (props: IProps) => {
  const {
    form, text, record, options, dispatchInfo, foreignKeys, index
  } = props;
  const editable = canColumnEdit(record, form, FOREIGNKEYS_KEY.FIELDNAME);
  const handleChange = (value) => {
    /** 设置字段编码 */
    form.setFieldsValue({ [FOREIGNKEYS_KEY.FIELDCODE]: value });
    dispatchInfo({
      type: 'editForeignKeys',
      name: { [index]: { ...record, fieldCode: value } }
    });
  };
  return editable ? (
    <Form.Item
      name={FOREIGNKEYS_KEY.FIELDCODE}
      rules={[
        { required: true, message: '字段名称必填' },
      ]}
    >
      <Select
        onClick = {(e) => e.stopPropagation()}
        onBlur = {(e) => e.stopPropagation()}
        options = {filterOptionsForChoose(options, foreignKeys, form)}
        onChange = {handleChange}
      />
    </Form.Item>
  ) : (
    <RenderText text={getlabelByMenue(options, text)}/>
  );
};
export default React.memo(FieldName);
