import { LogoutOutlined } from '@ant-design/icons';
import {
  Avatar, Menu, Spin, Card
} from 'antd';
import React from 'react';
import {
  ConnectProps, connect, Dispatch
} from 'umi';
import { ConnectState } from '@/models/connect';
import { IAccount } from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  account?: IAccount;
  menu?: boolean;
  dispatch?: Dispatch;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: {
    key: React.Key;
    keyPath: React.Key[];
    item: React.ReactInstance;
    domEvent: React.MouseEvent<HTMLElement>;
  }) => {
    const { key } = event;
    if (key === 'logout') {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }
    }
  };

  render(): React.ReactNode {
    const {
      account
    } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {/* <Card
          title="账户信息"
          bordered={false}
        >
          <div className={styles.list}>
            <span className={styles.title}>所在部门</span>
            <span className={styles.name}>浩云科技</span>
          </div>
        </Card> */}
        <Menu.Divider />
        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return account && account.loginname ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} alt="avatar" />
          <span className={`${styles.name} anticon`}>{account.username}</span>
        </span>
      </HeaderDropdown>
    )
      : (
        <span className={`${styles.action} ${styles.account}`}>
          <Spin
            size="small"
            style={{
              marginLeft: 8,
              marginRight: 8,
            }}
          />
        </span>
      );
  }
}

export default connect(({ user }: ConnectState) => ({
  account: user.account,
}))(AvatarDropdown);
