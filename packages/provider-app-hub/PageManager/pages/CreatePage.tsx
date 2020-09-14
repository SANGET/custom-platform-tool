import React from 'react';
import {
  Form, Input, Button, Select
} from 'antd';
import { createPageServices } from '../services/apis';

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const createPageDemo = {
  name: "测试页面",
  type: 2,
  belongToMenuId: "1",
  pageCode: "9214",
  iubDsl: "test iubdsl",
  businessCodes: [
    {
      widgetId: "1235",
      widgetName: "test widget",
      code: "34562",
      name: "test_code_name"
    }
  ],
  dataSources: [
    {
      datasourceId: "datasourceId"
    }
  ],
  formatRules: [
    {
      containerId: "containerId",
      datasourceId: "datasourceId",
      columnId: "columnId",
      formatContent: "格式化规则",
      type: "1",
      message: "fail message"
    }
  ],
  quotePopups: [
    {
      widgetId: "widgetId",
      popupId: "popupId"
    }
  ],
  usedWidgets: [
    {
      widgetId: "widget_id",
      name: "widget_name",
      pid: "pid",
      type: "1"
    }
  ],
  validationRules: [
    {
      containerId: "containerId validation",
      datasourceId: "datasourceId validation",
      columnId: "columnId validation",
      validationContent: "格式化规则 validation",
      type: "1",
      message: "fail message validation"
    }
  ]
};

export const CreatePage = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    // console.log(values);
    createPageServices(createPageDemo);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
      <Form.Item name="belongToMenuId" label="归属模块">
        <Input defaultValue="1" />
      </Form.Item>
      <Form.Item name="name" label="页面名称">
        <Input defaultValue="测试页面" />
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
