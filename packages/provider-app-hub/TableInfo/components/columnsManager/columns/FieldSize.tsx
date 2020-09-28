import React from 'react';
import { Form, InputNumber } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { COLUMNS_KEY } from '../constant';
import { canColumnEdit } from '../service';
import RenderText from '../../RenderText';

import { ITableColumn } from '../../../interface';

interface IProps {
  text: string
  record: ITableColumn
  form: FormInstance
  maxReg: RegExp
  max: number
}
export const FieldSize: React.FC<IProps> = (props: IProps) => {
  const {
    text, form, record, maxReg, max
  } = props;
  const editable = canColumnEdit(record, form, COLUMNS_KEY.FIELDSIZE);
  return editable ? (
    <Form.Item
      name={COLUMNS_KEY.FIELDSIZE}
      rules={[
        { required: true, message: '长度必填' },
        { pattern: maxReg, message: `请输入正整数，最大可输入${max}` },
      ]}
    >
      <InputNumber
        onClick = {(e) => e.stopPropagation()}
        onBlur = {(e) => e.stopPropagation()}
      />
    </Form.Item>
  ) : (
    <RenderText text={text}/>
  );
};
export default React.memo(FieldSize);
