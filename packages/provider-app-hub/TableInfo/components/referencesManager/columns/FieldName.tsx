import React from 'react';
import { Form, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import {
  REFERENCES_KEY
} from '../constant';

import { canColumnEdit, getlabelByMenue, filterOptionsForChoose } from '../service';
import RenderText from '../../RenderText';

import { IReference, ISELECTSMENU, IEditableRecord } from '../../../interface';

interface IProps {
  text: string
  record: IEditableRecord
  form: FormInstance
  options:ISELECTSMENU[]
  references: IReference[]
  index: number
  dispatchInfo:({ type: string, name: any })=>void
}
export const FieldName: React.FC<IProps> = (props: IProps) => {
  const {
    form, text, record, options, dispatchInfo, references, index
  } = props;
  const editable = canColumnEdit(record, form, REFERENCES_KEY?.FIELDNAME);
  const handleChange = (value) => {
    /** 设置字段编码 */
    form.setFieldsValue({ [REFERENCES_KEY?.FIELDCODE]: value });
    dispatchInfo({
      type: 'editReferences',
      name: { [index]: { ...record, fieldCode: value } }
    });
  };
  return editable ? (
    <Form.Item
      name={REFERENCES_KEY?.FIELDCODE}
      rules={[
        { required: true, message: '字段名称必填' },
      ]}
    >
      <Select
        onClick = {(e) => e.stopPropagation()}
        onBlur = {(e) => e.stopPropagation()}
        options = {filterOptionsForChoose(options, references, form)}
        onChange = {handleChange}
      />
    </Form.Item>
  ) : (
    <RenderText text={getlabelByMenue(options, text)}/>
  );
};
export default React.memo(FieldName);
