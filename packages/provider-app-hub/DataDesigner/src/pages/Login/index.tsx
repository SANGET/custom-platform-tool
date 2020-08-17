import React from 'react';
import {
  Form, Input, Button, Checkbox
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const FormWrapper = styled.div`
display:flex;
justify-content:center;
align-items:center;
height:100%;

& .login-form {
  border:1px solid #ccc;
  padding:50px 20px 20px 20px;
  width:400px;

}
& .login-form-forgot {
  float: right;
}
& .ant-col-rtl .login-form-forgot {
  float: left;
}
& .ant-form-item-control-input-content{
  display: flex;
  justify-content: space-between;
}
& .login-form-button {
  width: 160px;
}`;

/** 表单项label和content的宽度 */
const formItemLayout = {
  /** 满栅格是24, 设置label标签宽度 */
  labelCol: {
    span: 0
  },
  /** 设置表单项宽度 */
  wrapperCol: {
    span: 24
  }
};
const Login = () => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  return (
    <FormWrapper>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        {...formItemLayout}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="请输入密码"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>记住密码</Checkbox>
          </Form.Item>

          <a className="login-form-forgot">
          忘记密码
          </a>
        </Form.Item>

        <Form.Item className="oper-row">
          <Button className="login-form-button">注册</Button>
          <Button type="primary" htmlType="submit" className="login-form-button">登陆</Button>
        </Form.Item>
      </Form>
    </FormWrapper>
  );
};

export default Login;
