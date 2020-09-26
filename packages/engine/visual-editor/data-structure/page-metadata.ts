import { LayoutInfoActionReducerState } from "./layout";
import { WidgetBindPropItemsType } from "./widget";

/**
 * 页面的配置
 */
export interface PageMetadata {
  /** 记录最后一个创建的组件的 ID */
  lastCompID: number
  /** 记录数据源 */
  dataSource
  /** 页面标准接口 */
  pageInterface
  /** 联动配置 */
  linkpage
  name: string
}

/**
 * 基础页面数据
 */
export interface BasePageData {
  /** ID */
  id: string
  /** ID */
  pageID: string
  /** 页面名字 */
  name: string
  /** 页面布局内容 */
  content: LayoutInfoActionReducerState
  /** 页面元数据，包括联动、表达式、以及大部分的业务扩展 */
  meta: PageMetadata
}

/**
 * 页面元数据
 */
export interface PageStageEntity {
  /** 内部 page id，一般为固定 id */
  id: string
  /** 存放后端返回的 page id */
  pageID: string
  /** 绑定可编辑的属性 */
  bindPropItems: WidgetBindPropItemsType
}
