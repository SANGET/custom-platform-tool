import React, { useState } from 'react';
import { history, useModel, History } from 'umi';
import {
  Alert, Form, Input, Button, notification
} from 'antd';
import { LockTwoTone, UserOutlined } from '@ant-design/icons';

import { accountLogin, CLIENT_TYPE } from '@/services/login';
import styles from './style.less';

interface ILoginProps {
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
/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const replaceGoto = () => {
  setTimeout(() => {
    const { query } = history.location;
    const { redirect } = query as { redirect: string };
    if (!redirect) {
      history.replace('/');
      return;
    }
    (history as History).replace(redirect);
  }, 10);
};

const Login: React.FC<ILoginProps> = () => {
  const [message, setMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');
  const onFinish = async (values: ILoginParamsType) => {
    console.dir("onFinish");
    setSubmitting(true);
    const res = await accountLogin({ ...values, clientType: CLIENT_TYPE.WEB });
    console.dir(res);
    if (res.code === 0) {
      notification.success({
        message: '登录成功',
      });
      const info = await initialState?.fetchUserInfo();
      setInitialState(Object.assign({}, initialState, { currentUser: info?.result }));
      replaceGoto();
      return;
    }
    setMessage(res.message);
    setSubmitting(false);
  };
  return (
    <div className={styles.main}>
      { message && (
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

export default React.memo(Login);
