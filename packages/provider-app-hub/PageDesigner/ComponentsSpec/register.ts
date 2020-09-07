import { registerCompClass, registerPropItem } from '@engine/visual-editor/spec/registerComp';
import Input from './CompClass/Input';
import Table from './CompClass/Table';
import Selector from './PropItem/Selector';

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
      comp: Table
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
  ]);
}
