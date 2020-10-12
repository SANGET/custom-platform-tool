import { ElemNestingInfo } from "@engine/layout-renderer";
import { WidgetEntity } from "../data-structure";

/**
 * 选中的组件实例的数据结构
 */
export interface SelectEntityState {
  /** 选中的组件实例 ID */
  id: string
  /**
   * 选中的组件实例 index，采用数组嵌套结构
   * 例如 [0] 代表最外层的第 0 个元素中进行排序
   * 例如 [0, 1, 2] 代表最外层第 0 个元素中的第 1 个元素中的第 2 个元素
   */
  nestingInfo: ElemNestingInfo
  index?: number
  /** 选中的组件实例 */
  entity?: WidgetEntity
  /** 可支持多选 */
  selectedList?: {
    [id: string]: WidgetEntity
  }
}
