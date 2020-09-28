import React from 'react';
import { Form, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { COLUMNS_KEY, DATATYPEMENUFORTEXT } from '../constant';
import { canColumnEdit, getlabelByMenue } from '../service';
import RenderText from '../../RenderText';
import { ITableColumn, ISELECTSMENU } from '../../../interface';

interface IProps {
  text: string
  record: ITableColumn
  form: FormInstance
  dataTypeMenu: ISELECTSMENU[]
}
export const DataType: React.FC<IProps> = (props: IProps) => {
  const {
    record, form, text, dataTypeMenu
  } = props;
  const editable = canColumnEdit(record, form, COLUMNS_KEY.DATATYPE);
  // const handleChange = (e) => {
  //   const valueTmpl = e?.target?.value || '';
  //   form.setFieldsValue({
  //     [COLUMNS_KEY.DATATYPE]: e?.target?.value
  //   });
  //   // setValue(valueTmpl);
  // };
  return editable ? (
    <Form.Item
      name={COLUMNS_KEY.DATATYPE}
      rules={[
        { required: true, message: '数据类型必填' },
      ]}
    >
      <Select
        onClick = {(e) => e.stopPropagation()}
        onBlur = {(e) => e.stopPropagation()}
        options = {dataTypeMenu}
      />
    </Form.Item>
  ) : (
    <RenderText text={getlabelByMenue(DATATYPEMENUFORTEXT, text)}/>
  );
};
export default React.memo(DataType);
