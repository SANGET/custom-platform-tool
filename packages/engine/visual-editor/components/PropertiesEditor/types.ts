import { EditorPropertyItem } from "../../types";

/**
 * 属性项的渲染器标准接口
 */
export interface PropItemRendererProps {
  propItemConfig
  componentState
  propID: string
  onChange: (value: any, propItem: EditorPropertyItem) => void
}
