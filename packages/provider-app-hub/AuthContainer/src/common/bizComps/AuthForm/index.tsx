import React from 'react';
import {
  Form, TreeSelect, Input, Radio
} from 'antd';
import './authForm.less';

// 表单项label和content的宽度
const formItemLayout = {
  // label 标签布局
  labelCol: {
    span: 6
  },
  // 输入控件布局样式设置
  wrapperCol: {
    span: 14
  }
};

// 校验提示语
const validateMessages = {
  required: "'${name}' 是必选字段"
  // ...
};
const AuthForm = ({
  form, treeData, initialValues, ...rest
}) => {
  // 表单初始化
  form.setFieldsValue({
    authName: '',
    authCode: '',
    parentId: '',
    noAuthShow: 'hide',
  });
  const tProps = {
    treeData,
    value: '',
    placeholder: '请选择父级',
    style: {
      width: '100%',
    },
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
      <Form.Item label="权限名称" name="authName" rules={[{ required: true, message: '请输入权限名称!' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="权限编码" name="authCode" rules={[{ required: true, message: '请输入权限编码!' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="上级" name="parentId" rules={[{ required: false, message: '请选择上级!' }]}>
        <TreeSelect {...tProps}/>
      </Form.Item>

      <Form.Item name="noAuthShow" label="无权限时显示方式">
        <Radio.Group style={{ paddingLeft: '10px' }}>
          <Radio value="hide">隐藏</Radio>
          <Radio value="diabled">禁用</Radio>
        </Radio.Group>
      </Form.Item>
    </Form>
  );
};

export default AuthForm;
