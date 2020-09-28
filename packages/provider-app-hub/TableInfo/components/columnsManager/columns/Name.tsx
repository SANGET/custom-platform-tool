import React from 'react';
import { Form, Input } from 'antd';
import pinyin4js from 'pinyin4js';
import { FormInstance } from 'antd/lib/form';
import { COLUMNS_KEY, REPLUS, RE } from '../constant';
import { canColumnEdit, isRecordCustomed } from '../service';
import RenderText from '../../RenderText';
import { ITableColumn } from '../../../interface';

interface IProps {
  text: string
  record: ITableColumn
  form: FormInstance
}
export const Name: React.FC<IProps> = (props: IProps) => {
  const {
    text, record, form
  } = props;
  console.log(record);
  const editable = canColumnEdit(record, form, COLUMNS_KEY.NAME);
  const isCustomed = isRecordCustomed(record);
  /**
  * 格式化数据
  * 将数据中文转换成小写拼音, 并除去括号, 截取前 44 个长度
  * @param name
  * @returns str
  */
  const formatNameToCode = (name): string => {
    const pinyin = pinyin4js.convertToPinyinString(name, "", pinyin4js.WITHOUT_TONE);
    const substr = pinyin.replace(RE.BRACKETS, "").substring(0, 64);
    return substr.toLowerCase();
  };
  const handleChange = (e) => {
    const value = e?.target?.value;
    if (!isCustomed || !value) return;
    const pinyin = formatNameToCode(value);
    form?.setFieldsValue({
      code: pinyin
    });
    form?.validateFields(["code"]);
  };
  return editable ? (
    <Form.Item
      name={COLUMNS_KEY.NAME}
      rules={[
        { required: true, message: '字段名称必填' },
        { pattern: REPLUS.CENUSB, message: '请输入中文、英文、数字、下划线、括号' },
        { pattern: REPLUS.NONUF, message: '第一位不能是数字或下划线' },
        { max: 32, message: '限制输入32个字符' }
      ]}
    >
      <Input
        onClick = {(e) => e.stopPropagation()}
        onBlur = {(e) => e.stopPropagation()}
        onChange={handleChange}
      />
    </Form.Item>
  ) : (
    <RenderText text={text}/>
  );
};
export default React.memo(Name);
