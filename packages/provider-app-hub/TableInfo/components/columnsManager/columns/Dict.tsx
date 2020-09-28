import React from 'react';
import {
  Tag, Button
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
  const handleClick = () => {
    const {
      [COLUMNS_KEY.DICTIONARYFOREIGN]: id
    } = form.getFieldsValue([COLUMNS_KEY.DICTIONARYFOREIGNCN, COLUMNS_KEY.DICTIONARYFOREIGN]);
    dispatchColumns({
      type: 'allin',
      name: {
        dictId: id,
        visibleChooseDictModal: true
      }
    });
  };
  return editable ? (
    <Tag>
      <Button type = "link" onClick={handleClick}>{form.getFieldValue(COLUMNS_KEY.DICTIONARYFOREIGNCN)}</Button>
    </Tag>
    // </Form.Item>

  ) : <RenderText text={text}/>;
};
export default React.memo(Dict);
