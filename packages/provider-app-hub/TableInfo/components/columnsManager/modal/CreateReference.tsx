import React from 'react';
import {
  Form
} from 'antd';
import { RefTableCode, RefField } from '@provider-app/table-info/components/referencesManager/columns';
import { REFERENCES_KEY } from '@provider-app/table-info/components/referencesManager/constant';
import { ModalFooter } from '../../ModalFooter';
import { FormInstance } from '../interface';

interface IProps {
  onOk: (data:any) => void;
  onCancel: () => void;
}
interface IDict {
  id: string,
  name: string
}
const CreateReference: React.FC<IProps> = (props: IProps) => {
  const { onOk, onCancel } = props;
  const [form] = Form.useForm();
  const record = { editable: true };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const handleOk = async (formTmpl: FormInstance) => {
    try {
      await formTmpl.validateFields();
      const data = formTmpl.getFieldsValue([
        REFERENCES_KEY.REFTABLECODE, REFERENCES_KEY.REFTABLEID,
        REFERENCES_KEY.REFFIELDCODE, REFERENCES_KEY.REFDISPLAYCODE,
        REFERENCES_KEY.REFFIELDSIZE, REFERENCES_KEY.REFFIELDTYPE, REFERENCES_KEY.REFFIELDNAME
      ]);
      onOk && onOk(data);
    } catch (e) {
      console.log(e);
    }
  };
  const handleChange = (param) => {
    const { fieldType, fieldSize, name } = param;
    form.setFieldsValue({
      [REFERENCES_KEY.REFFIELDSIZE]: fieldSize,
      [REFERENCES_KEY.REFFIELDTYPE]: fieldType,
      [REFERENCES_KEY.REFFIELDNAME]: name
    });
  };
  const handleCancel = () => {
    onCancel && onCancel();
  };
  return (
    <Form form={form} {...layout}>
      <RefTableCode form={form} record={record} text='' label="关联表"/>
      <RefField
        form={form}
        record={record}
        text=""
        label = "关联字段"
        name="关联字段"
        code={REFERENCES_KEY.REFFIELDCODE}
        handleChange={handleChange}
      />
      <RefField
        form={form}
        record={record}
        text=""
        label="显示字段"
        name="显示字段"
        code={REFERENCES_KEY.REFDISPLAYCODE}
      />
      <ModalFooter
        onOk={() => { handleOk(form); }}
        onCancel={() => { handleCancel(); }}
      />
    </Form>
  );
};

export default React.memo(CreateReference);
