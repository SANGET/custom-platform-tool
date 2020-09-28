import React from 'react';
import { Form, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import {
  COLUMNS_KEY, FIELDTYPEMENU, FIELDTYPEMENUFORTEXT, DATATYPEMENU, FIELDSIZEREGULAR, FIELDTYPE
} from '../constant';

import { canColumnEdit, getlabelByMenue } from '../service';
import RenderText from '../../RenderText';

import { ITableColumn, ISELECTSMENU, IFieldSizeRegular } from '../interface';

interface IProps {
  text: string
  record: ITableColumn
  form: FormInstance
  dispatchColumns: ({ type: string, name: any }) => void
}
export const FieldType: React.FC<IProps> = (props: IProps) => {
  const {
    form, text, record, dispatchColumns
  } = props;
  const editable = canColumnEdit(record, form, COLUMNS_KEY.FIELDTYPE);
  const handleChange = (value) => {
    /** 设置小数点默认值 */
    if (value === FIELDTYPE.INT) {
      form.setFieldsValue({ [COLUMNS_KEY.DECIMALSIZE]: 0 });
    } else {
      form.setFieldsValue({ [COLUMNS_KEY.DECIMALSIZE]: '' });
    }
    let tmpl:{
      dataTypeMenu: ISELECTSMENU[],
      fieldSizeRegular: IFieldSizeRegular
    } = {
      dataTypeMenu: DATATYPEMENU[value]
    };
    const fieldSizeRegular = FIELDSIZEREGULAR[value];
    if (fieldSizeRegular) {
      tmpl = { ...tmpl, fieldSizeRegular };
    }
    dispatchColumns({
      type: 'allIn',
      name: tmpl
    });
    /** 设置长度默认值 */
    form.setFieldsValue({ [COLUMNS_KEY.FIELDSIZE]: fieldSizeRegular?.DEFAULT });
  };
  return editable ? (
    <Form.Item
      name={COLUMNS_KEY.FIELDTYPE}
      rules={[
        { required: true, message: '字段类型必填' },
      ]}
    >
      <Select
        onClick = {(e) => e.stopPropagation()}
        onBlur = {(e) => e.stopPropagation()}
        options = {FIELDTYPEMENU}
        onChange = {handleChange}
      />
    </Form.Item>
  ) : (
    <RenderText text={getlabelByMenue(FIELDTYPEMENUFORTEXT, text)}/>
  );
};
export default React.memo(FieldType);
