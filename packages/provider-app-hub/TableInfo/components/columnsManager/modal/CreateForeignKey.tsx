import React from 'react';
import { Form } from 'antd';
import { RefTableCode, RefField, StrategyRender } from '@provider-app/table-info/components/foreignKeysManager/columns';
import { FOREIGNKEYS_KEY } from '@provider-app/table-info/components/foreignKeysManager/constant';
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
const CreateForeignKey: React.FC<IProps> = (props: IProps) => {
  const { onOk, onCancel } = props;
  const [form] = Form.useForm();
  const record = { editable: true };

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  const handleOk = async (formTmpl: FormInstance) => {
    try {
      await formTmpl.validateFields();
      const data = formTmpl.getFieldsValue([
        FOREIGNKEYS_KEY.REFTABLECODE, FOREIGNKEYS_KEY.REFFIELDCODE, FOREIGNKEYS_KEY.REGTABLEID,
        FOREIGNKEYS_KEY.REFDISPLAYCODE,
        FOREIGNKEYS_KEY.REFFIELDSIZE, FOREIGNKEYS_KEY.REFFIELDTYPE, FOREIGNKEYS_KEY.REFFIELDNAME,
        FOREIGNKEYS_KEY.UPDATESTRATEGY, FOREIGNKEYS_KEY.DELETESTRATEGY
      ]);
      onOk && onOk(data);
    } catch (e) {
      console.log(e);
    }
  };
  const handleChange = (param) => {
    const { fieldType, fieldSize, name } = param;
    form.setFieldsValue({
      [FOREIGNKEYS_KEY.REFFIELDSIZE]: fieldSize,
      [FOREIGNKEYS_KEY.REFFIELDTYPE]: fieldType,
      [FOREIGNKEYS_KEY.REFFIELDNAME]: name
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
        code={FOREIGNKEYS_KEY.REFFIELDCODE}
        handleChange={handleChange}
      />
      <RefField
        form={form}
        record={record}
        text=""
        label="显示字段"
        name="显示字段"
        code={FOREIGNKEYS_KEY.REFDISPLAYCODE}
      />
      <StrategyRender record = {record} label="外键约束（删除时）" code={FOREIGNKEYS_KEY.DELETESTRATEGY}/>
      <StrategyRender record = {record} label="外键约束（更新时）" code={FOREIGNKEYS_KEY.UPDATESTRATEGY}/>
      <ModalFooter
        onOk={() => { handleOk(form); }}
        onCancel={() => { handleCancel(); }}
      />
    </Form>
  );
};

export default React.memo(CreateForeignKey);
