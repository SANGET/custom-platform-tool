import React from 'react';
import { Form, Select } from 'antd';
import RenderText from '@provider-app/table-info/components/RenderText';
import { getlabelByMenue } from '../service';
import { IEditableRecord } from '../../../interface';

interface IProps {
  name: string
  label?: string
  record: IEditableRecord
  text?: string
}
const options = [
  { label: '存在关联不允许操作', key: 'RESTRICT', value: 'RESTRICT' },
  { label: '级联', key: 'CASCADE', value: 'CASCADE' },
  { label: '置空', key: 'SET_NULL', value: 'SET_NULL' },
  { label: '不处理', key: 'NO_ACTION', value: 'NO_ACTION' },
];
const StrategyRender: React.FC<IProps> = (props: IProps) => {
  const {
    label, name, record, text
  } = props;
  return record.editable ? (
    <Form.Item label={label} name={name} >
      <Select options={options}/>
    </Form.Item>
  ) : (
    <RenderText text={getlabelByMenue(options, text)}/>
  );
};
export default React.memo(StrategyRender);
