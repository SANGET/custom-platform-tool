import React, { useState } from 'react';
import { connect, Dispatch } from 'umi';
import {
  Alert, Form, Input, Button
} from 'antd';
import { LockTwoTone, UserOutlined } from '@ant-design/icons';

import { ConnectState } from '@/models/connect';

import { CLIENT_TYPE } from '@/services/login';
import { ILoginModelState } from '@/models/login';
import styles from './style.less';

interface ILoginProps {
  dispatch: Dispatch;
  userLogin: ILoginModelState;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);
interface ILoginParamsType {
  username: string;
  password: string;
}
const Login: React.FC<ILoginProps> = (props) => {
  const { submitting, userLogin: { message } } = props;

  const onFinish = (values: ILoginParamsType) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values, clientType: CLIENT_TYPE.WEB },
    });
  };
  return (
    <div className={styles.main}>
      {message && (
        <LoginMessage content={message} />
      )}
      <Form
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{
            required: true,
            message: '请填写用户名'
          }]}
        >
          <Input
            size="large" prefix={<UserOutlined style={{
              color: '#1890ff',
            }}
            />}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{
            required: true,
            message: '请输入密码'
          }]}
        >
          <Input.Password size="large" prefix={<LockTwoTone />} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>登录</Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
