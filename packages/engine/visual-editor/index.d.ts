import { RegisterCompElementProps } from './spec/registerComp';

type CompClass = React.ElementType<RegisterCompElementProps>
type PropItemComp = React.ElementType<RegisterCompElementProps>

/**
 * 可视化编辑器引擎的全局 type
 */
declare global {
  /** VisualEditor */
  namespace VE {
    /** 组件类 */
    type CompClass = CompClass
    /** 属性项 */
    type PropItemComp = PropItemComp
    /** 核心定义 */
  }
}
