import React from 'react';

export const UserStatusbar = ({
  logout
}) => {
  return (
    <div
      onClick={logout}
      className="user-statusbar p10"
    >
      退出登录
    </div>
  );
};
