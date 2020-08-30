import { registerComps } from '@engine/visual-editor/spec/registerComp';
import Input from './Input';
import Table from './Table';

/**
 * 在应用层面上的组件注册
 */
export default function registerComponents() {
  registerComps({
    Input,
    Table,
  });
}
