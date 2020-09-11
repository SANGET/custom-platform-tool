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

  const onGenderChange = (value) => {
    switch (value) {
      case "male":
        form.setFieldsValue({ note: "Hi, man!" });
        return;
      case "female":
        form.setFieldsValue({ note: "Hi, lady!" });
        return;
      case "other":
        form.setFieldsValue({ note: "Hi there!" });
    }
  };

  const onFinish = (values) => {
    // console.log(values);
    createPageServices(createPageDemo);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFill = () => {
    form.setFieldsValue({
      note: 'Hello world!',
      gender: 'male',
    });
  };

  return (
    <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
      <Form.Item name="note" label="Note">
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
