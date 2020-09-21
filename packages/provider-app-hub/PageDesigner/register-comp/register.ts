import { registerCompClass, registerPropItem, registerEditor } from '@engine/visual-editor/spec/registerComp';
import { Input, Table } from '@spec/business-components';
import { TableEditor } from './CustomEditor/TableEditor';
import { Selector, FieldSelector } from './PropItem';

/**
 * 在应用层面上的组件注册
 */
export default function registerComponents() {
  /** 注册组件类 */
  registerCompClass([
    {
      name: 'Input',
      comp: Input
    },
    {
      name: 'Table',
      comp: Table,
      propEditor: TableEditor
    },
  ]);
  /** 注册属性项 */
  registerPropItem([
    {
      name: 'Input',
      comp: Input
    },
    {
      name: 'Selector',
      comp: Selector
    },
    {
      name: 'FieldSelector',
      comp: FieldSelector
    },
  ]);
}
