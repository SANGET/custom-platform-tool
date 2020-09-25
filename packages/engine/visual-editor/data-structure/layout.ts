import { ElemNestingInfo } from '@engine/layout-renderer/types';
import { EditorComponentEntity } from './core';

export {
  ElemNestingInfo
};

/**
 * state 的数据结构
 */
export type LayoutInfoActionReducerState = EditorComponentEntity[]

export interface FlatLayoutItems {
  [entityID: string]: EditorComponentEntity
}
