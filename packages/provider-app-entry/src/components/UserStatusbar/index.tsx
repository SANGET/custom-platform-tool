import { LogoutOutlined } from '@ant-design/icons';
import React from 'react';

export const UserStatusbar = ({
  logout
}) => {
  return (
    <LogoutOutlined
      onClick={logout}
      title="退出登录"
      className="user-statusbar ps20"
    />
  );
};
