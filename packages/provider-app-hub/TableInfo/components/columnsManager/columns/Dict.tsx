import React from 'react';
import {
  Form, Input
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { COLUMNS_KEY } from '../constant';
import { canColumnEdit } from '../service';

import RenderText from '../../RenderText';
import { ITableColumn } from '../../../interface';

interface IProps {
  text: string
  record: ITableColumn
  form: FormInstance
  dispatchColumns: ({ type: stirng, name: any })=>void
}
const Dict: React.FC<IProps> = (props: IProps) => {
  const {
    text, record, form, dispatchColumns
  } = props;
  const editable = canColumnEdit(record, form, COLUMNS_KEY.DICTIONARYFOREIGN);
  const handleClick = (e) => {
    const {
      [COLUMNS_KEY.DICTIONARYFOREIGN]: id
    } = form.getFieldsValue([COLUMNS_KEY.DICTIONARYFOREIGNCN, COLUMNS_KEY.DICTIONARYFOREIGN]);
    dispatchColumns({
      type: 'allIn',
      name: {
        dictIds: id?.split(','),
        visibleChooseDictModal: true
      }
    });
    e?.stopPropagation();
  };
  return editable ? (
    <Form.Item name={COLUMNS_KEY.DICTIONARYFOREIGNCN}>
      <Input
        className="pointer"
        onClick={handleClick} readOnly
        title={form.getFieldValue(COLUMNS_KEY.DICTIONARYFOREIGNCN)}
      />
    </Form.Item>
  ) : <RenderText text={text}/>;
};
export default React.memo(Dict);
