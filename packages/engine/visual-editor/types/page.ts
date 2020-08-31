import { LayoutInfoActionReducerState } from "./layout";

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
}

/**
 * 基础页面数据
 */
export interface BasePageData {
  id: string
  pageID: string
  name: string
  content: LayoutInfoActionReducerState
  meta: PageMetadata
}
