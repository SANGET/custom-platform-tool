/// //////////////// 属性项 ///////////////////

import { ChangeMetadata } from "../core";
import { WidgetEntity } from "./widget";

export type PropItemCompRender = ({
  /** 属性的值 */
  propItemValue,
  /** onChange 事件 */
  onChange,
  /** 表达式助手，由属性项自身决定是否使用 */
  fxHelper,
}) => JSX.Element

export interface NextEntityState {
  /** 目标属性 */
  attr: string
  /** 属性的值 */
  value: any
}

export type NextEntityStateType = NextEntityState | NextEntityState[]

export type ChangeEntityState = (nextEntityState: NextEntityStateType) => void

export interface TakeMetaOptions {
  /** meta 的 attr */
  metaAttr: string
  /** meta 的引用 ID */
  metaRefID?: string
}

export type TakeMeta = (options: TakeMetaOptions) => unknown

export type GenMetaRefID = (metaAttr: string) => string

export interface PropItemRenderContext {
  /** 业务数据 */
  businessPayload: PD.PropItemRendererBusinessPayload
  /** 编辑中的组件实例 */
  readonly widgetEntity: WidgetEntity
  /** 组件实例状态 */
  readonly editingWidgetState: any
  /** 更改组件实例状态的接口 */
  changeEntityState: ChangeEntityState
  /** 更改页面的 meta 数据 */
  changeMetadata: typeof ChangeMetadata
  takeMeta: TakeMeta
  /** 生成 meta 引用的 ID */
  genMetaRefID: GenMetaRefID
}

/**
 * 属性项
 * @description 节点含义说明：第一层为描述属性项的元数据，propItemCompDef 节点为描述该属性项中用于交互的组件
 */
export interface PropItemMeta {
  /** 属性项 ID */
  readonly id: string
  /** 属性项显示的 label */
  readonly label: string
  /**
   * 1. 需要编辑的组件实例状态的哪些属性；
   * 2. 如果指定的是数组，则传入到属性项的 widgetEntityState 为包含所有定义的对象结构；
   * 3. 可以被组件元数据的 editAttr 定义覆盖；
   */
  readonly whichAttr: string | string[]
  /** 是否使用 meta */
  readonly useMeta?: string | string[]
  /**
   * 1. 属性项给予组件实例的默认值
   * 2. 会被组件元数据的 defaultValues 中覆盖
   */
  readonly defaultValue?: any
  /** 多个属性的默认值 */
  readonly defaultValues?: {
    [whichAttr: string]: any
  }
  /** 渲染属性项 */
  render(propItemRenderCtx: PropItemRenderContext): JSX.Element
}
