/// //////////////// 属性项 ///////////////////

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

export interface PropItemRenderContext {
  /** 内部的已绑定的数据源 */
  interDatasources: PD.Datasources
  /** 组件实例状态 */
  widgetEntityState: any
  /** 更改组件实例状态的接口 */
  changeEntityState: ChangeEntityState
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
  readonly whichAttr: string[]
  /**
   * 1. 属性项给予组件实例的默认值
   * 2. 会被组件元数据的 defaultValues 中覆盖
   */
  defaultValue?: any
  /** 多个属性的默认值 */
  defaultValues?: {
    [whichAttr: string]: any
  }
  /** 渲染属性项 */
  render(ctx: PropItemRenderContext): JSX.Element
}
