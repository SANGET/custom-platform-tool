/**
 * 在 form 表单中有标题的 Input 组件
 */
import React from 'react';
import { Input } from 'antd';
import { BusinessWidgetAccessSpec } from '../../interfaces';

export const FormInput = ({
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

export default class FormInputSpec implements BusinessWidgetAccessSpec {
  name = 'FormInput'

  render(widgetState) {
    return (
      <FormInput {...widgetState} />
    );
  }
}
