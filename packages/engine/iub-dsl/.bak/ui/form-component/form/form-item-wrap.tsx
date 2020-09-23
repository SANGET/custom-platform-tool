import React from 'react';
import { Form } from 'antd';
import { FormItemProps } from 'antd/lib/form';

const HyFromItem: React.FC<FormItemProps> = ({ children, ...props }) => {
  console.log('HyFromItem');
  return (
    <Form.Item
      {...props}
    >
      {children}
    </Form.Item>
  );
};

export { HyFromItem };
