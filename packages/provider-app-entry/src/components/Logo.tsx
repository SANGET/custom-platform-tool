import { GoogleOutlined, LeftOutlined } from '@ant-design/icons';
import React from 'react';

export const Logo = ({
  app,
  appName = '自定义工具 3.0',
  isEntryApp,
  ...props
}) => {
  return (
    <div {...props}>
      <div
        className="ps20 text-xl flex items-center"
      >
        {
          isEntryApp ? <LeftOutlined /> : <GoogleOutlined />
        }
        <span className="ml-2">
          {appName}
        </span>
      </div>
    </div>
  );
};
