/**
 * 可拖拽项包装器的定义
 */
import {
  LayoutWrapperContext
} from '@engine/layout-renderer';
import { DragItemActions } from '..';
import { Dispatcher } from '../../core/actions';
import { EditorComponentEntity, EditorEntityState, ElemNestingInfo } from '../../types';

export interface GetStateContext {
  nestingInfo: ElemNestingInfo
  idx: number
  id: string
}

export type GetEntityProps = (ctx: GetStateContext) => EditorEntityState | undefined
export type GetSelectedState = (ctx: GetStateContext) => boolean
export type GetLayoutNode = (ctx: GetStateContext) => EditorComponentEntity

export interface WrapperFacContext {
  /** 获取选中的组件实例的状态 */
  getSelectedState: GetSelectedState
  /** 获取组件实例的 props */
  getEntityProps: GetEntityProps
  /** 扁平的 node 结构 */
  getLayoutNode: GetLayoutNode
  UpdateEntityState: Dispatcher['UpdateEntityState']
}

interface ActionCtx {
  entity: EditorComponentEntity
  idx: number
  nestingInfo: ElemNestingInfo
}

export type WrapperItemClockEvent = (event, actionCtx: ActionCtx) => void
export type WrapperItemDeleteEvent = (event, actionCtx: ActionCtx) => void

/**
 * 包装器的 actions
 */
export interface WrapperFacActions extends DragItemActions {
  /** 响应组件点击事件 */
  onClick: WrapperItemClockEvent
  /** 响应组件点击事件 */
  onDelete: WrapperItemDeleteEvent
}

/**
 * 包装器的 options
 */
export interface WrapperFacOptions extends WrapperFacContext, WrapperFacActions {
}

/**
 * 包装器传给被包装的组件的 props
 */
export interface FacToComponentProps extends LayoutWrapperContext {
  onClick: React.DOMAttributes<HTMLDivElement>['onClick']
  entity: EditorComponentEntity
  entityState: EditorEntityState
}

/**
 * 可拖拽包装器的定义
 */
export type DragableItemWrapperFac = (
  wrapperFacOptions: WrapperFacOptions
) => (
  props: LayoutWrapperContext
) => JSX.Element
