import { GoogleOutlined } from '@ant-design/icons';
import React from 'react';

export const Logo = (props) => {
  return (
    <div {...props}>
      <div
        className="ps20 text-xl flex items-center"
      >
        <GoogleOutlined />
        <span>
        自定义工具 3.0
        </span>
      </div>
    </div>
  );
};
