/// //////////////// 拖拽 ///////////////////

import { WidgetTypeMeta } from "./widget";

/**
 * 基本拖拽项
 */
export interface BasicDragableItemType {
  /** 用于临时记录拖拽时的位置，被拖拽时动态赋值的 */
  index?: number
  /** 可拖拽的项的类型 */
  type: string
  /** 拖拽带的 item 参数 */
  dragableWidgetType: any
  /** 自定义的拖拽的配置 */
  dragConfig?: any
}

/**
 * 组件类拖拽项
 */
export interface DragableItemType extends BasicDragableItemType {
  dragableWidgetType: WidgetTypeMeta
}

/**
 * 接受拖 item 的 prop
 */
export interface DropCollectType {
  isOver: boolean
  isOverCurrent: boolean
  canDrop: boolean
}
