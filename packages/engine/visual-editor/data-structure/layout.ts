// import { ElemNestingInfo } from '@engine/layout-renderer/types/layout-node-info';
import { WidgetEntity } from "./widget";

// export {
//   ElemNestingInfo
// };

/**
 * state 的数据结构
 */
export type LayoutInfoActionReducerState = WidgetEntity[]

export interface FlatLayoutItems {
  [entityID: string]: WidgetEntity
}
