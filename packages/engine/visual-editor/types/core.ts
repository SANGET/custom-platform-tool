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
  /** 组件类型 */
  component: {
    type: string
  }
  /** 绑定可编辑的属性 */
  properties: {
    /** 绑定的属性的 id */
    propRefs: string[]
  }
}

/// //////////////// 属性 ///////////////////

/**
 * 属性项
 */
export interface EditorPropertyItem {
  /** 属性项 ID */
  id: string
  /** 显示的 label */
  label: string
  /** 属性的类型 */
  type: string
  /** 属性作用于组件实例的某种属性 */
  target: 'style' | 'data'
  /** 用于渲染该属性组件的配置信息 */
  component: {
    /** 用于找到具体组件 */
    type: 'Input'
  }
}

/**
 * 返回属性项的函数接入方式
 */
export type PropertyItemConfigFunc = (entity: EditorComponentEntity) => EditorPropertyItem

/**
 * 属性项接入方式
 */
export type PropertyItemConfig = PropertyItemConfigFunc | EditorPropertyItem

/**
 * 属性项集合
 */
export interface EditorPropertyItemsCollection {
  [colID: string]: PropertyItemConfig
}

/// //////////////// 组件实例状态 ///////////////////

/**
 * 组件实例状态项
 */
export interface EditorEntityStateItem {
  /** 属性类型 */
  propType: string
  /** 属性的值 */
  value: any
}

export interface EntityStyle extends React.CSSProperties {
  color: string
}

/**
 * 组件实例状态
 */
export interface EditorEntityState {
  /** 原始的实例状态数据 */
  propOriginState?: {
    [stateID: string]: EditorEntityStateItem
  }
  /** 绑定的页面内唯一数据 ID */
  dataID?: string
  /** 样式 */
  style?: React.CSSProperties
}

/**
 * 整个画布的组件实例状态集合
 */
export interface EntitiesStateStore {
  [entityID: string]: EditorEntityState
}

/// //////////////// 实例状态 ///////////////////

/**
 * 组件实例
 */
export interface EditorComponentEntity extends EditorComponentClass {
  /** 实例 id */
  id: string;
  /** 组件实例状态数据 */
  // entityState: EditorEntityState
  /** 实例化后的状态 */
  _state: string
  // _state: 'active' | 'disable'
  /** 实例化后的 class id */
  _classID: EditorComponentClass['id']
}

/**
 * 组件实例
 */
export interface EditorComponentEntityStore {
  [entityID: string]: EditorComponentEntity
}

/// //////////////// 拖拽 ///////////////////

/**
 * 基本拖拽项
 */
export interface DragItemType {
  type: string
  dragItemClass: any
  dragConfig?: any
}

/**
 * 组件类拖拽项
 */
export interface DragComponentClass extends DragItemType {
  type: string
  dragItemClass: EditorComponentClass
}

/**
 * 接受拖 item 的 prop
 */
export interface DropCollectType {
  isOverCurrent: boolean
}
