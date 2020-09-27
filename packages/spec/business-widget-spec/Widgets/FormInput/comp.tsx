/**
 * 在 form 表单中有标题的 Input 组件
 */
import React from 'react';
import { Input } from 'antd';

export const FormInputComp = ({
  title,
  compContext,
  value,
}) => {
  return (
    <div>
      {title}
      <Input value={value} />
    </div>
  );
};
