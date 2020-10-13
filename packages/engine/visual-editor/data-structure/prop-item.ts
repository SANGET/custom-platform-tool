/// //////////////// 属性项 ///////////////////

import { WidgetEntity } from "./widget";

export type PropItemCompRender = ({
  /** 属性的值 */
  propItemValue,
  /** onChange 事件 */
  onChange,
  /** 表达式助手，由属性项自身决定是否使用 */
  fxHelper,
}) => JSX.Element

/**
 * 属性项
 * @description 节点含义说明：第一层为描述属性项的元数据，propItemCompDef 节点为描述该属性项中用于交互的组件
 */
export interface PropItemMeta {
  /** 属性项 ID */
  readonly id: string
  /** 属性项显示的 label */
  readonly label: string
  /** 作用于组件实例的属性，例如 entity[propType] */
  readonly whichAttr: string
  // whichAttr: VEExtention.PropItemTypes
  // /** 属性作用于组件实例的某种属性 */
  // target: string
  /** 默认值 */
  defaultValue?: any
  /** 属性项的渲染组件的定义 */
  propItemCompDef?: {
    /** 用于找到具体组件 */
    type: string
  }
  /** 用于渲染的组件 */
  render(ctx: PropItemRenderContext): JSX.Element
}

export type ChangeEntityState = (nextEntityState: WidgetEntity['propState']) => void

export interface PropItemRenderContext {
  /** 组件实例状态 */
  widgetEntityState: any
  /** 更改组件实例状态的接口 */
  changeEntityState: ChangeEntityState
}

export type PropItemCompAccessSpecCtx = {}

/**
 * 属性项的组件的接入标准
 */
export type PropItemCompAccessSpec = (propItemCompAccessSpecCtx: PropItemCompAccessSpecCtx) => PropItemMeta
