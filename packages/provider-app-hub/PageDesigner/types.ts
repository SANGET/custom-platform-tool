/**
 * 定义属性项可以改动的属性
 */

export interface ColumnItem {
  id: string
  name: string
  /** 数据类型 */
  colDataType: string
  /** 字段 size */
  fieldSize: string
  /** 字段类型 */
  fieldType: string
  /** 字段的名字 */
  fieldCode: string
}

export interface DatasourceItem {
  /** 该条记录的 id */
  id: string
  /** 该条记录关联的表的 id */
  moduleId: string
  /** 名字 */
  name: string
  /** 类型 */
  type: string
  /** columns */
  columns: ColumnItem[]
}

export interface PDPropItemRendererBusinessPayload {
  /** 内部的已绑定的数据源 */
  interDatasources: PD.Datasources
}

export type DatasourceGroup = DatasourceItem[]

declare global {
  /** PageDesigner */
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace PD {
    type Column = ColumnItem
    type Datasource = DatasourceItem
    type Datasources = DatasourceGroup
    /** 属性项的业务承载 */
    type PropItemRendererBusinessPayload = PDPropItemRendererBusinessPayload
  }
  /** 页面设计器的类型定义 */
}
