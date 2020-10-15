/// //////////////// widget ///////////////////

import { PropItemCompAccessSpec } from ".";

/**
 * 基础组件类型
 */
interface BasicWidgetType {
  type: string
}

export type EditAttr = string | string[]

/**
 * 组件引用属性项的配置项
 */
export interface PropItemRefs {
  /** 引用的属性项的 id */
  propID: string
  /**
   * 1. 该属性项编辑的属性
   * 2. 可以覆盖由属性项元数据中声明的 whichAttr 属性
   * 3. 如果不填，默认可以修改全部属性
   */
  editAttr?: EditAttr
  /** 覆盖属性项定义的值 */
  override?: {
    defaultValue?: any
  }
}

/**
 * widget 绑定的属性
 */
export interface WidgetBindPropItemsType {
  /** 绑定的属性项 */
  propItemRefs?: PropItemRefs[]
  /** 原生属性配置 */
  rawPropItems?: PropItemCompAccessSpec[]
}

/**
 * 编辑器中的元素类 element class
 * 用于存储组件的元数据信息
 */
export interface BasicWidgetClassType<C> {
  /** 组件类型 id */
  id: string
  /** 组件类面板的显示名 */
  label: string;
  /** 组件类面板的显示名 */
  desc?: string;
  /** 绑定可编辑的属性 */
  bindPropItems: WidgetBindPropItemsType
  /** 组件类型定义 widget definition */
  widgetDef: C
}

export interface WidgetEditablePropMeta {
  type: 'string' | 'number' | 'boolean' | 'any' | 'struct'
}

export interface WidgetEditableProps {
  [propName: string]: WidgetEditablePropMeta
}

/**
 * 可拖动的组件的 class
 */
export interface WidgetMetadata<C = BasicWidgetType> extends BasicWidgetClassType<C> {
  id: string
  /** 可以指定组件类被实例化时的 id */
  entityID?: string
  /** 可编辑的属性 */
  editableProps: WidgetEditableProps
}

/// //////////////// widget entity ///////////////////

/**
 * 组件实例信息
 */
export interface WidgetEntity extends WidgetMetadata {
  /** 实例 id */
  id: string
  /** 子元素 */
  body?: WidgetEntity[]
  /** 存储组件实例的状态 */
  propState?: WidgetEntityState
  /** 实例化后的状态 */
  _state: string
  // _state: 'active' | 'disable'
  /** 实例化后的 class id */
  _classID: WidgetMetadata['id']
}

/**
 * 组件实例状态
 */
export interface WidgetEntityState {
  value?: any
}

/// //////////////// temp widget entity 临时组件实例 ///////////////////

export const TEMP_ENTITY_ID = 'temp-entity';
/**
 * 由于拖动产生的临时 entity
 */
export interface TempWidgetEntityType {
  id: string
  /** 标志性为临时实例 */
  _state: typeof TEMP_ENTITY_ID
}
