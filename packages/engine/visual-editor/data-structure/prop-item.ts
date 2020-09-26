/// //////////////// 属性项 ///////////////////

/**
 * 属性项
 * @description 节点含义说明：第一层为描述属性项的元数据，propItemCompDef 节点为描述该属性项中用于交互的组件
 */
export interface PropItemType {
  /** 属性项 ID */
  id: string
  /** 属性项显示的 label */
  label: string
  /** 用于定位组件实例的属性，例如 entity[propType] */
  type: VEExtention.PropItemTypes
  // /** 属性作用于组件实例的某种属性 */
  // target: string
  /** 默认值 */
  defaultValue?: any
  /** 属性项的渲染组件的定义 */
  propItemCompDef: {
    /** 用于找到具体组件 */
    type: string
  }
  /** 是否需要表达式 */
  useFx?: boolean
}
