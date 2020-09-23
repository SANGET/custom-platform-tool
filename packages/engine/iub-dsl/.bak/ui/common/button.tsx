import React from 'react';
import { Button } from 'antd';
import { ButtonProps, ButtonType } from 'antd/lib/button';
import { OmitExtral } from '../../types';

interface ButtonPropsExtral {
  text: string;
}

//  & React.RefAttributes<HTMLElement>
const HyButton: React.FC<OmitExtral<ButtonProps, ButtonPropsExtral>> = ({
  text, ...otherProps
}) => {
  return (
    <Button
      {...otherProps}
    >{text}</Button>
  );
};

export {
  HyButton
};
