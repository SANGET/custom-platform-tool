/**
 * 可视化编辑器数据结构类型
 */

/// //////////////// 组件 ///////////////////

/**
 * 可拖动的组件的 class
 */
export interface EditorComponentClass {
  /** 组件类型 */
  type: 'container' | 'component'
  /** 组件类型 id */
  id: string
  /** 父级 ID */
  parentID?: string
  /** 实例 ID */
  entityID?: string
  /** 显示的标签 */
  label: string;
  /** 绑定可编辑的属性 */
  properties: {
    /** 绑定的属性的 id */
    propRefs: string[]
  }
}

/**
 * 可拖动的组件实例化结构
 */
export interface EditorComponentEntity extends EditorComponentClass {
  /** 实例 id */
  id: string;
  /** 实例化后的状态 */
  _state: 'active' | 'disable'
  /** 实例化后的 class id */
  _classID: string
}

/// //////////////// 属性 ///////////////////

/**
 * 属性类型
 */
export interface EditorPropertyClass {
  /** 属性类型 ID */
  id: string
  /** 显示的 label */
  label: string
  /** 属性的类型 */
  type: string
  /** 用于渲染该属性组件的配置信息 */
  component: {
    /** 用于找到具体组件 */
    type: 'Input'
  }
}

/**
 * 函数方式接入
 */
export type PropertyItemClassConfigFunc = (entity: EditorComponentEntity) => EditorPropertyClass

/**
 * 属性组件接入方式
 */
export type PropertyItemClassConfig = PropertyItemClassConfigFunc | EditorPropertyClass

/**
 * 属性集合
 */
export interface EditorPropertyCollection {
  [colID: string]: PropertyItemClassConfig
}

/// //////////////// 实例的属性数据 ///////////////////

/**
 * 组件实例存储的单个属性数据
 */
export interface EditorEntityPropertyStateItem {
  /** 属性类型 */
  propType: string
  /** 属性的值 */
  value: any
}

/**
 * 组件实例存储的所有属性数据集合
 */
export interface EditorEntityProperties {
  [stateID: string]: EditorEntityPropertyStateItem
}

/**
 * 存储属性
 */
export interface EntityPropertiesStore {
  [entityID: string]: EditorEntityProperties
}

/// //////////////// 拖拽 ///////////////////

/**
 * 拖的 item 的类型
 */
export interface DragItemType {
  type: string
  dragItemClass: EditorComponentClass
  dragConfig?: any
}

/**
 * 接受拖 item 的 prop
 */
export interface DropCollectType {
  isOverCurrent: boolean
}
