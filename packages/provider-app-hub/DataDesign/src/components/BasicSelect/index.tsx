/** 基础组件--选择框 */
import React from 'react';
import {
  Select
} from 'antd';
/** 选项组件 */
const { Option } = Select;
/** props目前只有一个属性enum--选项枚举 */
/** 后续可以扩展 */
export const BasicSelect = (props) => {
  return (
    <Select defaultValue="" style={{ width: props.width || '' }} allowClear>
      {props.enum.map((item) => (
        <Option key={item.text} value={item.value}>
          {item.text}
        </Option>
      ))}
    </Select>);
};
