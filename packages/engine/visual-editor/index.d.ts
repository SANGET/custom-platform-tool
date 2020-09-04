import { RegisterCompElementProps } from './spec/registerComp';

type CompClass = React.ElementType<RegisterCompElementProps>

/**
 * 可视化编辑器引擎的全局 type
 */
declare global {
  /** VisualEditor */
  namespace VE {
    type CompClass = CompClass
  }
}
