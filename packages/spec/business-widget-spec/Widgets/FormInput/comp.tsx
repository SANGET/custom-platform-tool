/**
 * 在 form 表单中有标题的 Input 组件
 */
import React from 'react';
import { Input } from 'antd';

/**
 * FormInput 必须的 props
 */
export interface FormInputCompProps {
  title: string
  /** 默认值 */
  defValue: string
  labelColor: string
}

export const FormInputComp: React.FC<FormInputCompProps> = (props) => {
  const {
    title,
    labelColor,
    defValue,
  } = props;

  return (
    <div>
      <div
        style={{
          color: labelColor
        }}
      >
        {title}
      </div>
      <Input value={defValue} style={{ width: 300 }} />
    </div>
  );
};
