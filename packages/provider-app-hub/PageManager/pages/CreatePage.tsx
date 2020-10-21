import React from 'react';
import {
  Form, Input, Button, Radio, TreeSelect, Space
} from 'antd';
import useMenuList from '../useMenuList';
import { createPageServices } from '../services/apis';
import { PAGE_TYPE_ENUM } from '../constant';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface IOnSuccessParams {
  id:string;
  name:string
}

interface IProps {
  onSuccess:(item: IOnSuccessParams) => void;
}

export const CreatePage = ({
  onSuccess
}: IProps) => {
  const [form] = Form.useForm();
  const [menusData] = useMenuList();

  const onFinish = (values) => {
    console.log(111, values);
    createPageServices({
      ...values,
      belongMenus: values.belongMenus.map((menuId: string) => ({ menuId }))
    })
      .then((res) => {
        if (res.code === "00000") {
          onSuccess({ id: res.result, name: values.name });
        }
      });
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form
      {...layout}
      form={form}
      name="control-hooks"
      onFinish={onFinish}
      initialValues={{
        type: 1,
        belongMenus: []
      }}

    >
      <Form.Item name="name" label="页面名称" rules={[{ required: true }]}>
        <Input placeholder="请输入页面名称" />
      </Form.Item>
      <Form.Item name="belongMenus" label="归属模块">
        <TreeSelect
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={menusData}
          placeholder="请选择模块"
          treeCheckable
        />
      </Form.Item>
      <Form.Item name="type" label="页面类型" rules={[{ required: true }]}>
        <Radio.Group>
          {
            PAGE_TYPE_ENUM.map(({ text, value }) => <Radio key={value} value={value}>{text}</Radio>)
          }
        </Radio.Group>
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Space>
          <Button type="primary" htmlType="submit">
            开始创建
          </Button>
          <Button htmlType="button" onClick={onReset}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
