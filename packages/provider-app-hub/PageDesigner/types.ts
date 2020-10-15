/**
 * 定义属性项可以改动的属性
 */

export interface ColumnItem {
  id: string
  name: string
  dataType: string
}

export interface DatasourceItem {
  /** 该条记录的 id */
  id: string
  /** 该条记录关联的表的 id */
  moduleId: string
  /** 名字 */
  name: string
  /** columns */
  columns: ColumnItem[]
}

export type DatasourceGroup = DatasourceItem[]

declare global {
  /** PageDesigner */
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace PD {
    type Column = ColumnItem
    type Datasource = DatasourceItem
    type Datasources = DatasourceGroup
  }
  /** 页面设计器的类型定义 */
}
