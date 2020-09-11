import React, { useEffect } from 'react';
import { Form, message } from 'antd';
import { NameCodeItem, FromFooterBtn } from "./FormItem"

import './index.less'
import { copyTableService } from '../service';

interface IProps {
  onOk: () => void;
  onCancel: () => void;

  data: any;
}
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};
const CopyTable: React.FC<IProps> = (props: IProps) => {
  const { onCancel, onOk, data } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    const { name, code } = data;
    form && form.setFieldsValue({
      name: name,
      code: code
    })
  }, [])
  const handleFinish = async (values) => {
    const res = await copyTableService({ ...values, id: data.id })
    if (res.code === "00000") {
      message.success("复制成功")
      onOk && onOk()
    } else {
      message.error(res.msg)
    }
  }

  const handleFormCancel = () => {
    onCancel && onCancel()
  }
  return (
    <Form {...layout} form={form} name="control-hooks" onFinish={handleFinish}>
      <NameCodeItem form={form} />
      <FromFooterBtn
        okText="确定"
        onCancel={handleFormCancel}
      />
    </Form>
  );
};

export default React.memo(CopyTable);
