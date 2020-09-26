/**
 * 可拖拽项包装器的定义
 */
import {
  LayoutWrapperContext
} from '@engine/layout-renderer';
import { DragItemActions } from '..';
import { VEDispatcher } from '../../core/actions';
import { WidgetEntity, WidgetEntityState, ElemNestingInfo } from '../../data-structure';

export interface GetStateContext {
  nestingInfo: ElemNestingInfo
  idx: number
  id: string
}

export type GetEntityProps = (ctx: GetStateContext) => WidgetEntityState | undefined
export type GetSelectedState = (ctx: GetStateContext) => boolean
export type GetLayoutNode = (ctx: GetStateContext) => WidgetEntity

export interface WrapperFacContext {
  /** 获取选中的组件实例的状态 */
  getSelectedState: GetSelectedState
  /** 获取组件实例的 props */
  getEntityProps: GetEntityProps
  /** 扁平的 node 结构 */
  getLayoutNode: GetLayoutNode
  UpdateEntityState: VEDispatcher['UpdateEntityState']
}

interface ActionCtx {
  entity: WidgetEntity
  idx: number
  nestingInfo: ElemNestingInfo
}

export type WrapperItemClickEvent = (event, actionCtx: ActionCtx) => void
export type WrapperItemDeleteEvent = (event, actionCtx: ActionCtx) => void

/**
 * 包装器的 actions
 */
export interface WrapperFacActions extends DragItemActions {
  /** 响应组件点击事件 */
  onItemClick: WrapperItemClickEvent
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
  entity: WidgetEntity
  entityState: WidgetEntityState
}

/**
 * 可拖拽包装器的定义
 */
export type DragableItemWrapperFac = (
  wrapperFacOptions: WrapperFacOptions
) => (
  props: LayoutWrapperContext
) => JSX.Element
