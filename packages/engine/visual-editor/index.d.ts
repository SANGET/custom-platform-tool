import { RegisterCompElementProps } from './spec/registerComp';

/**
 * 可视化编辑器引擎的全局 type
 */
declare global {
  /** VisualEditor */
  namespace VE {
    /** 组件类 */
    export type CompClass = React.ElementType<RegisterCompElementProps>
    /** 属性项 */
    export type PropItemComp = React.ElementType<RegisterCompElementProps>
    /** 属性项的定义 */
  }
}
