/**
 * 可视化编辑器数据结构类型
 */

/// //////////////// 组件 ///////////////////

interface GenericComponentType {
  type: string
}

export interface PropRefItem {
  /** 引用的属性项的 id */
  propID: string
  /** 覆盖属性项定义的值 */
  override?: {
    defaultValue?: any
  }
}

export interface ComponentBindPropsConfig {
  /** 绑定的属性项 */
  propRefs?: PropRefItem[]
  /** 原生属性配置 */
  rawProp?: PropertyItemConfigFunc[]
}

/**
 * 编辑器中的元素类 element class
 * 用于存储组件的元数据信息
 */
export interface EditorBasicElementClass<C> {
  /** 组件类型 id */
  id: string
  /** 组件类面板的显示名 */
  label: string;
  /** 组件类面板的显示名 */
  desc?: string;
  /** 绑定可编辑的属性 */
  bindProps: ComponentBindPropsConfig
  /** 元素的组件类型 */
  component: C
}

/**
 * 可拖动的组件的 class
 */
export interface EditorComponentClass<C = GenericComponentType> extends EditorBasicElementClass<C> {
  id: string
  /** 可以指定组件类被实例化时的 id */
  entityID?: string
}

/// //////////////// 属性 ///////////////////

/**
 * 属性项
 */
export interface EditorPropertyItem {
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
  /** 用于渲染该属性组件的配置信息 */
  component: {
    /** 用于找到具体组件 */
    type: string
  }
  /** 是否需要表达式 */
  fx?: boolean
}

/**
 * 返回属性项的函数接入方式
 */
export type PropertyItemConfigFunc = (entity: EditorComponentEntity) => EditorPropertyItem

/**
 * 属性项集合
 */
export interface EditorPropertyItemsCollection {
  [colID: string]: PropertyItemConfigFunc
}

/**
 * 组件类集合
 */
export interface ComponentClassCollection {
  [id: string]: EditorComponentClass
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
  value?: any
}

/**
 * 整个画布的组件实例状态集合
 */
export interface EntitiesStateStore {
  [entityID: string]: EditorEntityState
}

/// //////////////// 实例状态 ///////////////////

/**
 * 页面元数据
 */
export interface EditorPageEntity {
  /** 内部 page id，一般为固定 id */
  id: string
  /** 存放后端返回的 page id */
  pageID: string
  /** 绑定可编辑的属性 */
  bindProps: ComponentBindPropsConfig
}

/**
 * 组件实例信息
 */
export interface EditorComponentEntity extends EditorComponentClass {
  /** 实例 id */
  id: string
  /** 子元素 */
  body?: EditorComponentEntity[]
  /** 存储组件实例的状态 */
  propState?: EditorEntityState
  /** 实例化后的状态 */
  _state: string
  // _state: 'active' | 'disable'
  /** 实例化后的 class id */
  _classID: EditorComponentClass['id']
}

export const TEMP_ENTITY_ID = 'temp-entity';
/**
 * 由于拖动产生的临时 entity
 */
export interface TempEntity {
  id: string
  /** 标志性为临时实例 */
  _state: typeof TEMP_ENTITY_ID
}

/**
 * 编辑器的实例种类
 */
export type EditorEntity = EditorComponentEntity
//  | EditorPageEntity

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
  /** 用于临时记录拖拽时的位置，被拖拽时动态赋值的 */
  index?: number
  /** 可拖拽的项的类型 */
  type: string
  /** 拖拽带的 item 参数 */
  dragItemClass: any
  /** 自定义的拖拽的配置 */
  dragConfig?: any
}

/**
 * 组件类拖拽项
 */
export interface DragItemClass extends DragItemType {
  dragItemClass: EditorComponentClass
}

/**
 * 接受拖 item 的 prop
 */
export interface DropCollectType {
  isOver: boolean
  isOverCurrent: boolean
  canDrop: boolean
}
