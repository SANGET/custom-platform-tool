import React from 'react';
import {
  Form, TreeSelect, Input
} from 'antd';
import './tableStructForm.less';

import { BasicSelect } from '@data-design/components/BasicSelect';
import { TableTypeEnum } from '@data-design/tools/constant';

const { TextArea } = Input;

/** 表单项label和content的宽度 */
const formItemLayout = {
  /** label 标签布局 */
  labelCol: {
    span: 6
  },
  /** 输入控件布局样式设置 */
  wrapperCol: {
    span: 14
  }
};

/** 校验提示语 */
const validateMessages = {
  // required: `${name} 是必选字段`
  // ...
};
const AuthForm = ({
  form, treeData, initialValues, ...rest
}) => {
  /** 表单初始化 */
  form.setFieldsValue({
    authName: '',
    authCode: '',
    parentId: '',
    noAuthShow: 'hide'
  });
  const tProps = {
    treeData,
    value: '',
    placeholder: '请选择父级',
    style: {
      width: '100%'
    }
  };
  return (
    <Form
      name="auth-form"
      {...formItemLayout}
      form={form}
      initialValues={initialValues}
      validateMessages={validateMessages}
      className="auth-form"
      {...rest}
    >
      <Form.Item label="数据表名称" name="authName" rules={[{ required: true, message: '请输入数据表名称!' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="数据表编码" name="authCode" rules={[{ required: true, message: '请输入数据表编码!' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="type" label="表类型">
        <BasicSelect enum={TableTypeEnum} />
      </Form.Item>

      <Form.Item label="归属模块" name="parentId" rules={[{ required: false, message: '请选择上级!' }]}>
        <TreeSelect {...tProps} />
      </Form.Item>

      <Form.Item name="label" label="标签">
        <Input />
      </Form.Item>

      <Form.Item name="remark" label="备注">
        <TextArea autoSize={{ minRows: 4, maxRows: 6 }} />
      </Form.Item>
    </Form>
  );
};

export default AuthForm;
