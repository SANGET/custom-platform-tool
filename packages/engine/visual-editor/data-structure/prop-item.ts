/// //////////////// 属性项 ///////////////////

export type PropItemCompRender = ({
  /** onChange 事件 */
  onChange,
  /** 内部组件 */
  InterComp,
  /** 表达式助手，由属性项自身决定是否使用 */
  fxHelper,
}) => JSX.Element

/**
 * 属性项
 * @description 节点含义说明：第一层为描述属性项的元数据，propItemCompDef 节点为描述该属性项中用于交互的组件
 */
export interface PropItemType {
  /** 属性项 ID */
  id: string
  /** 属性项显示的 label */
  label: string
  /** 作用于组件实例的属性，例如 entity[propType] */
  whichAttr: VEExtention.PropItemTypes
  // /** 属性作用于组件实例的某种属性 */
  // target: string
  /** 默认值 */
  defaultValue?: any
  /** 直接渲染属性项组件的内容 */
  propItemCompRender?: PropItemCompRender
  /** 属性项的渲染组件的定义 */
  propItemCompDef?: {
    /** 用于找到具体组件 */
    type: string
  }
}
