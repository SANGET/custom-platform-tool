import React from 'react';
import { Form, InputNumber } from 'antd';
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
export const DecimalSize: React.FC<IProps> = (props: IProps) => {
  const {
    text, record, form
  } = props;
  const editable = canColumnEdit(record, form, COLUMNS_KEY.DECIMALSIZE);
  return editable ? (
    <Form.Item
      name={COLUMNS_KEY.DECIMALSIZE}
      rules={[
        { pattern: REPLUS.ZE, message: '小数位数最多只能输入8位' },
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
export default React.memo(DecimalSize);
