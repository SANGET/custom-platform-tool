/**
 * 在 form 表单中有标题的 Input 组件
 */
import React from 'react';
import { Button } from 'antd';

/**
 * FormInput 必须的 props
 */
export interface FormButtonProps {
  text: string
  onClick: () => void
}

export const FormButtonComp: React.FC<FormButtonProps> = (props) => {
  const {
    text,
    onClick,
  } = props;

  return (
    <div>
      <Button
        onClick={(e) => {
          onClick?.();
        }}
      >
        {text}
      </Button>
    </div>
  );
};
