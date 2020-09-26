import { registerCompClass, registerPropItem } from '@engine/visual-editor/spec/registerComp';
import Input from './CompClass/Input';
import Table from './CompClass/Table';
import Selector from './PropItem/Selector';

/**
 * 在应用层面上的组件注册
 */
export default function registerComponents() {
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
