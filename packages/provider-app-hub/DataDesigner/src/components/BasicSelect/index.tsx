/** 基础组件--选择框 */
import React from 'react';
import { Select } from 'antd';
/** 选项组件 */
const { Option } = Select;
/**
 * props必须有属性enum,它是一个常量数组,用此值遍历生成选项
 * enum数组每项至少包含两个属性text-显示文本,value-选项值
 * antd-Select组件不提供遍历数组生成下拉选项的功能
 * 所以封装了这个组件
 */
export const BasicSelect = (props) => {
  return (
    <Select {...props} allowClear>
      {props.enum.map((item) => (
        <Option key={item.text} value={item.value}>
          {item.text}
        </Option>
      ))}
    </Select>);
};
