import React from 'react';
import { Tooltip } from 'antd';

const HyToolTip = ({ tipContent, children, ...ohter }) => {
  console.log('HyToolTip');
  return (
    <Tooltip title={tipContent} {...ohter}>{children}</Tooltip>
  );
};

export {
  HyToolTip
};
