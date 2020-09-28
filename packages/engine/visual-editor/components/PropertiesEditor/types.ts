import { ChangeEntityState } from "@spec/business-widget";
import { PropItemType } from "../../data-structure";

/**
 * 属性项的渲染器标准接口
 */
export interface PropItemRendererProps {
  propItemConfig: PropItemType
  /** 属性项的值 */
  propItemValue
  /** 属性项的 onChange 回调 */
  onChange: ChangeEntityState
}
