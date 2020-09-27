import { ElemNestingInfo } from '@engine/layout-renderer/types';
import { WidgetEntity } from './core';

export {
  ElemNestingInfo
};

/**
 * state 的数据结构
 */
export type LayoutInfoActionReducerState = WidgetEntity[]

export interface FlatLayoutItems {
  [entityID: string]: WidgetEntity
}
