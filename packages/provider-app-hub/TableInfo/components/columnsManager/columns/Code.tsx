import React from 'react';
import { Form, Input } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { COLUMNS_KEY, REPLUS } from '../constant';
import { canColumnEdit } from '../service';
import RenderText from '../../RenderText';

import { ITableColumn } from '../../../interface';

interface IProps {
  text: string
  record: ITableColumn
  form: FormInstance
}
const Code: React.FC<IProps> = (props: IProps) => {
  const {
    text, record, form
  } = props;
  const editable = canColumnEdit(record, form, COLUMNS_KEY.CODE);
  return editable ? (
    <Form.Item
      name={COLUMNS_KEY.CODE}
      rules={[
        { required: true, message: '字段编码必填' },
        { pattern: REPLUS.ENUS, message: '请输入英文、数字、下划线、括号，限制输入64个字符' },
        { pattern: REPLUS.NONUF, message: '第一位不能是数字或下划线' }
      ]}
    >
      <Input
        onClick = {(e) => e.stopPropagation()}
        onBlur = {(e) => e.stopPropagation()}
      />
    </Form.Item>
  ) : (
    <RenderText text={text}/>
  );
};
export default React.memo(Code);
