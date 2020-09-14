import { EditorPropertyItem } from "../../types";

/**
 * 属性项的渲染器标准接口
 */
export interface PropItemRendererProps {
  propItemConfig: EditorPropertyItem
  /** 属性项的值 */
  propItemValue
  /** 属性项的 onChange 回调 */
  onChange: (value: any, propItem: EditorPropertyItem) => void
}
