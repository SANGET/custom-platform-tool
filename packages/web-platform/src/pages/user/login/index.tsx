/* eslint-disable camelcase */
import React from 'react';
import { connect, Dispatch, history } from 'umi';
import {
  Alert, Form, Input, Button,
} from 'antd';
import { LockTwoTone, UserOutlined } from '@ant-design/icons';

import { ConnectState } from '@/models/connect';

import { CLIENT_TYPE } from '@/services/login';
import { ILoginModelState } from '@/models/login';
import { getPageQuery, getQueryByParams } from '@/utils/utils';
import { IDefaultSettings } from 'config/defaultSettings';
import styles from './style.less';

interface ILoginProps {
  dispatch: Dispatch;
  userLogin: ILoginModelState;
  submitting?: boolean;
  settings: IDefaultSettings;
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
  const { submitting, userLogin: { message }, settings } = props;

  const onFinish = async (values: ILoginParamsType) => {
    const { dispatch } = props;
    const res = await dispatch({
      type: 'login/login',
      payload: { ...values, clientType: CLIENT_TYPE.WEB },
    });
    const { access_token, refresh_token } = res?.data || {};
    console.log('access_token', access_token);
    if (access_token) {
      dispatch({
        type: 'user/setCurrentUser',
        payload: {
          token: access_token,
          refreshToken: refresh_token
        }
      });
      routerLink();
    }
  };
  const routerLink = () => {
    const urlParams = new URL(window.location.href);
    const params = getPageQuery();
    const queryLink = getQueryByParams(["mode", "app", "lessee"]);
    let { redirect } = params as { redirect: string };
    if (redirect) {
      const redirectUrlParams = new URL(redirect);
      if (redirectUrlParams.origin === urlParams.origin) {
        redirect = redirect.substr(urlParams.origin.length);
        if (redirect.match(/^\/.*#/)) {
          redirect = redirect.substr(redirect.indexOf('#') + 1);
        }
      } else {
        window.location.href = `/?${queryLink}`;
        return;
      }
    }
    history.replace(redirect || `/?${queryLink}`);
  };

  return (
    <div className={styles.main}>
      {/* {message && (
        <LoginMessage content={message} />
      )} */}
      <div className={styles["form-container"]}>
        <div className={styles.title}> {settings.title}</div>
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
            <Button type="primary" size="large" className={styles['submit-btn']} htmlType="submit" loading={submitting}>登录</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default connect(({ login, loading, settings }: ConnectState) => ({
  userLogin: login,
  settings,
  submitting: loading.effects['login/login'],
}))(Login);
