import React from 'react';
import { Input, InputNumber, TreeSelect } from 'antd';

/**
 * 颜色选择器
 */
import BasicColorPicker, { BasicColor } from '@provider-app/data-designer/src/components/BasicColorPicker';
/**
 * 在antd Select组件基础上封装的选择框组件
 */
import { BasicSelect } from '@provider-app/data-designer/src/components/BasicSelect';

/**
* 表结构编辑 tabs面板业务组件
*/
import TableField from '@provider-app/data-designer/src/pages/EditStruct/TableField';
import ReferenceTable from '@provider-app/data-designer/src/pages/EditStruct/ReferenceTable';
import ForeignKeySet from '@provider-app/data-designer/src/pages/EditStruct/ForeignKeySet';
import ComposeUnique from '@provider-app/data-designer/src/pages/EditStruct/ComposeUnique';
import IndexSet from '@provider-app/data-designer/src/pages/EditStruct/IndexSet';
import Trigger from '@provider-app/data-designer/src/pages/EditStruct/Trigger';
import TableLog from '@provider-app/data-designer/src/pages/EditStruct/TableLog';

/**
 * TextArea是Input的一个分支
 */
const { TextArea } = Input;
/**
 * 组件列表
 */
const components = {
  Input,
  InputNumber,
  TextArea,
  BasicSelect,
  BasicColor,
  BasicColorPicker,
  TreeSelect,
  TableField,
  ReferenceTable,
  ForeignKeySet,
  ComposeUnique,
  IndexSet,
  Trigger,
  TableLog
};

/**
 * 组件仓库-动态渲染组件
 */
const BasicStory = (props) => {
  /**
   * type是组件类型
   */
  const SpecificStory = components[props.type];
  return <SpecificStory {...props} />;
};
/**
* fasdf
*/
export default BasicStory;
