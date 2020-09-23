import React, { useContext } from 'react';
import { Input } from 'antd';
import { InputProps, InputState } from 'antd/lib/input/Input';
import { OmitExtral } from '../../../types';

interface InputPropsExtral {
  value: string | number;
  onChange: ((event: React.ChangeEvent<HTMLInputElement>) => void);
}

const HyInput: React.FC<OmitExtral<InputProps, InputPropsExtral>> = ({
  value = '', onChange, ...ohterProps
}) => {
  console.log('HyInput');
  return (
    <Input
      // value={value}
      // onChange={(e) => {
      //     onChange?.(e);
      // }}
      {...ohterProps}
    />
  );
};

export {
  HyInput
};
