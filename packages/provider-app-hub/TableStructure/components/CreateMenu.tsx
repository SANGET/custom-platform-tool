import React from 'react';
import { Form, Input, message } from 'antd';
import { MENUS_TYPE, RE } from '../constant';

import { ModuleTreeItem, FromFooterBtn } from "./FormItem";
import { createMenuService } from '../service';

import './index.less';

interface IProps {
  onCancel: () => void;
  onOk: () => void;
}
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};
const CreateMenu: React.FC<IProps> = (props: IProps) => {
  const { onCancel, onOk } = props;
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    const { name, moduleId } = values;
    const params = {
      name,
      pid: moduleId,
      type: MENUS_TYPE.MODULE
    };
    const res = await createMenuService(params);
    if (res.code === "00000") {
      message.success("新增成功");
      onOk && onOk();
    } else {
      message.error(res.msg);
    }
  };

  const handleClose = () => {
    onCancel && onCancel();
  };
  return (

    <Form {...layout} form={form} name="control-hooks" onFinish={handleFinish}>
      <Form.Item
        name="name"
        label="模块名称"
        rules={[
          { required: true },
          { pattern: RE.CEN, message: '请输入中文、英文、数字' },
          { max: 32, message: '最多只能输入32个字符' },
        ]}
      >
        <Input placeholder="" />
      </Form.Item>
      <ModuleTreeItem />
      <FromFooterBtn
        onCancel={handleClose}
      />
    </Form>

  );
};

export default React.memo(CreateMenu);
