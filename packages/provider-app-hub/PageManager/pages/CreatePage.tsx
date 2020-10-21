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

export const CreatePage = ({
  onSuccess
}) => {
  const [form] = Form.useForm();
  const [menusData] = useMenuList();

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
        type: 1
      }}

    >
      <Form.Item name="name" label="页面名称">
        <Input placeholder="请输入页面名称" />
      </Form.Item>
      <Form.Item name="moduleId" label="归属模块">
        <TreeSelect
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={menusData}
          placeholder="请选择模块"
          treeDefaultExpandAll
        />
      </Form.Item>
      <Form.Item name="type" label="页面类型">
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
          取消
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
