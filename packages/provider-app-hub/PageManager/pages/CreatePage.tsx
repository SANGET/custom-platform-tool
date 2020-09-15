import React from 'react';
import {
  Form, Input, Button
} from 'antd';
import { v4 as uuidv4 } from '@infra/utils/uuid';
import { createPageServices } from '../services/apis';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export const CreatePage = ({
  onSuccess
}) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    createPageServices(values)
      .then(() => {
        onSuccess();
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
        name: '测试页面',
        type: 2
      }}
    >
      <Form.Item name="name" label="页面名称">
        <Input />
      </Form.Item>
      <Form.Item name="type" label="页面类型">
        <Input />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <Button htmlType="button" onClick={onReset}>
          Reset
        </Button>
      </Form.Item>
    </Form>
  );
};
