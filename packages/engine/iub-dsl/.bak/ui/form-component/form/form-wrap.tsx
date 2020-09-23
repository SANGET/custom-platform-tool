import React from 'react';
import { Form } from 'antd';
import { FormProps } from 'antd/lib/form';

const HyFrom: React.FC<FormProps> = ({ children, ...props }) => {
  return (
    <Form
      {...props}
    >
      {children}
    </Form>
  );
};

export { HyFrom };
