/**
 * 可视化编辑器数据结构类型
 */

/**
 * 可拖动的组件的 class
 */
export interface EditorComponentClass {
  type: 'container' | 'component'
  id: string
  label: string;
  // TODO: 绑定可编辑的属性
  properties: {
    propRefs: string[]
  }
}

/**
 * 可拖动的组件实例化结构
 */
export interface EditorComponentEntity extends EditorComponentClass {
  /** 实例化后的状态 */
  _state: 'active' | 'disable'
}

/**
 * 实例化后的组件存储的属性数据
 */
export interface EditorComponentEntityProperties {

}

/**
 * 属性类型
 */
export interface EditorPropertyClass {

}
