import React from 'react';
import { AllComponentType } from '@iub-dsl/types';
import {
  HyInput, HyToolTip, HyFromItem, HyFrom
} from '../ui';

type UIType = AllComponentType | 'From' | 'FromItem' | 'HyToolTip'

export const Input = ({ value, onChange, ...ohterProps }) => {
  return (
    <HyInput
      value={value}
      onChange={onChange}
      {...ohterProps}
    />
  );
};

// TODO: 类型问题
export const GetUI = (type: UIType): React.FC<any> => {
  switch (type) {
    case AllComponentType.Input:
      return Input;
    case 'HyToolTip':
      return HyToolTip;
    default:
      return () => <div>没有获得对应组件</div>;
  }
};

export { HyFromItem, HyFrom };
