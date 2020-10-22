import { VEAppDispatcher } from "../../core";
import { ChangeEntityState, PropItemMeta } from "../../data-structure";

/**
 * 属性项的渲染器标准接口
 */
export interface PropItemRendererProps {
  propItemMeta: PropItemMeta
  /** 属性项的值 */
  propItemValue: unknown
  /** 属性项的 onChange 回调 */
  changeEntityState: ChangeEntityState
  ChangeMetadata: VEAppDispatcher['ChangeMetadata']
}
