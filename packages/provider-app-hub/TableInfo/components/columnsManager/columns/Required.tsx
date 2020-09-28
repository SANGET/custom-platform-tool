import React from 'react';
import { Form, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { COLUMNS_KEY, VALUEBOOLEANMENU } from '../constant';
import { canColumnEdit, getlabelByMenue } from '../service';
import RenderText from '../../RenderText';
import { ITableColumn } from '../../../interface';

interface IProps {
  text: string
  record: ITableColumn
  form: FormInstance
}
export const Required: React.FC<IProps> = (props: IProps) => {
  const {
    text, record, form
  } = props;
  const editable = canColumnEdit(record, form, COLUMNS_KEY.REQUIRED);
  return editable ? (
    <Form.Item
      name={COLUMNS_KEY.REQUIRED}
    >
      <Select
        onClick = {(e) => e.stopPropagation()}
        options={VALUEBOOLEANMENU}
        onBlur = {(e) => e.stopPropagation()}
        onChange={(value) => {
          form.setFieldsValue({ [COLUMNS_KEY.REQUIRED]: value });
        }}
      />
    </Form.Item>
  ) : (
    <RenderText text={getlabelByMenue(VALUEBOOLEANMENU, text)}/>
  );
};
export default React.memo(Required);
