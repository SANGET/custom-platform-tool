/**
 * 在 form 表单中有标题的 Input 组件
 */
import React from 'react';
import { Input } from 'antd';

/**
 * FormInput 必须的 props。在属性项定义时通过 whichAttr 属性指定
 */
export interface FormInputCompProps {
  title: string
  value: string
  labelColor: string
}

export const FormInputComp: React.FC<FormInputCompProps> = (props) => {
  const {
    title,
    labelColor,
    value,
  } = props;
  return (
    <div>
      <span
        style={{
          color: labelColor
        }}
      >
        {title}
      </span>
      <Input value={value} />
    </div>
  );
};
