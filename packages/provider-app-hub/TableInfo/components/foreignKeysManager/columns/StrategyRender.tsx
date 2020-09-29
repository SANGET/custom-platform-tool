import React from 'react';
import { Form, Select } from 'antd';
import RenderText from '@provider-app/table-info/components/RenderText';
import { getlabelByMenue, canColumnEdit } from '../service';
import { FormInstance, IEditableRecord, IForeignKeyShowKey } from '../../../interface';

interface IProps {
  name?: string
  label?: string
  record: IEditableRecord
  text?: string
  code: IForeignKeyShowKey
  form: FormInstance
}
const StrategyRender: React.FC<IProps> = (props: IProps) => {
  const {
    label, name, record, text, code, form
  } = props;

  const options = [
    { label: '存在关联不允许操作', key: 'RESTRICT', value: 'RESTRICT' },
    { label: '级联', key: 'CASCADE', value: 'CASCADE' },
    { label: '置空', key: 'SET_NULL', value: 'SET_NULL' },
    { label: '不处理', key: 'NO_ACTION', value: 'NO_ACTION' },
  ];
  const editable = canColumnEdit(record, form, code);
  return editable ? (
    <Form.Item
      label={label} name={code}
      rules={[
        { required: true, message: `${label || name}必填` },
      ]}
    >
      <Select
        onClick = {(e) => e.stopPropagation()}
        onBlur = {(e) => e.stopPropagation()}
        options={options}
      />
    </Form.Item>
  ) : (
    <RenderText text={getlabelByMenue(options, text)}/>
  );
};
export default React.memo(StrategyRender);
