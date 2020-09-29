import React from 'react';
import { Form } from 'antd';
import { FormProps } from 'antd/lib/form';
import { AllUI } from '../../types';

const fromWrapCompName = AllUI.BaseInput;
const FromWrapFactory: React.FC<FormProps> = ({ children, ...props }) => {
  return (
    <Form
      layout="vertical"
      {...props}
    >
      {children}
    </Form>
  );
};

export { FromWrapFactory, fromWrapCompName };
