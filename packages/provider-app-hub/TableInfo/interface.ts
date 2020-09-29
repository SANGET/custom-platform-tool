import { FormInstance } from 'antd/lib/form';

export { FormInstance };
/** 提示用户信息：提示类型（成功，提示，提醒，失败） */
export type IStatus = "success" | "info" | "warning" | "error"

/** 表类型 */
export type ITableType = "TABLE" | "TREE" | "AUX_TABLE"
/** 附属表相关信息 */
export interface IAuxTableInfo {
  parentTable: ITableInfoFromApi
}
export interface ITreeTableInfo {
  maxLevel: number
}
/** 关联页面 */
export interface IRelatedPage {
  id: string
  name: string
}
// 表字段---------------------------------------------------------------------------------------------
/** 表字段信息：字段类型（字符串，整型，长整型，时间，日期，日期时间，超大文本） */
export type IFieldType = "STRING" | "INT" | "LONG" | "TIME" | "DATE" | "DATE_TIME" | "TEXT"

/** 表字段信息：数据类型（普通字段，主键字段，字典字段，外键字段，图片，视频，音频） */
export enum IDataType {
  NORMAL = "NORMAL",
  PK = "PK",
  QUOTE = "QUOTE",
  DICT = "DICT",
  FK = "FK",
  IMG = "IMG",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  FILE="FILE"
}

/** 表字段信息：业务字段类型（
 * SYS(系统元数据)
 * BIS(业务元数据)
 * SYS_TMPL(系统元数据,允许修改)
 * BIS_TMPL(业务元数据,禁止删除)）
 * */
export enum ISpecies {
  SYS = "SYS",
  BIS = "BIS",
  SYS_TMPL = "SYS_TMPL",
  BIS_TMPL="BIS_TMPL"
}

/** 表字段信息：字典信息 */
interface IDictionaryForeign {
  id: string
  tableName: string
  fieldCode: string
  refTableName: string
  refFieldCode: string
  refDisplayFieldCode: string
  species: ISpecies
}

/** 表字段管理：其他信息（必填，唯一，转换成拼音，校验规则 */
interface IFieldProperty {
  required: boolean
  unique: boolean
  pinyinConvent: boolean
}
/** 字段管理 */
export interface ITableColumnFromApi {
  /** 唯一标识id */
  id: string
  /** 字段名称 */
  name: string
  /** 字段编码 */
  code: string
  /** 字段类型 */
  fieldType: IFieldType
  /** 长度 */
  fieldSize: number

  /** 数据类型 */
  dataType: IDataType
  /** 分类 */
  species: ISpecies
  /** 小数位数 */
  decimalSize: number
  /** 字典配置 */
  dictionaryForeign: IDictionaryForeign
  /** 其他信息配置 */
  fieldProperty: IFieldProperty
  regular: string
}

export type ITableColumnShowKey = "id" | "name" | "code" | "fieldType" | "dataType" | "fieldSize" | "decimalSize" | "species" | "required" | "unique" | "dictionaryForeign"
export interface ITableColumn {
  /** 唯一标识id */
  id: string
  /** 字段名称 */
  name: string
  /** 字段编码 */
  code: string
  /** 字段类型 */
  fieldType: IFieldType
  /** 长度 */
  fieldSize: number

  /** 数据类型 */
  dataType: IDataType
  /** 分类 */
  species: ISpecies
  /** 小数位数 */
  decimalSize?: number
  /** 字典唯一标识 */
  dictionaryForeign: string
  /** 必填 */
  required: boolean
  /** 唯一 */
  unique: boolean
  /** 字典名称 */
  dictionaryForeignCn?: string
  /** 拼音 */
  pinyinConvert: boolean
  /** 编码规则唯一标识 */
  /** 是否可编辑 */
  editable?: boolean
  /** 是否用户生成 */
  createdCustomed?: boolean
  regular: string
}

export interface ISELECTSMENU {
  label: string
  key: string
  value: string
}

/** 引用表 */
export interface IRef {
  id: string
  fieldCode: string
  fieldName: string
  refTableCode: string
  refFieldCode: string
  refFieldName: string
  refFieldType: IFieldType
  refFieldSize: number
  refDisplayFieldCode: string
  createdCustomed: boolean
  species: ISpecies
  editable: boolean
}
export type IReferenceShowKey = "id" | "fieldCode" | "fieldName" | "refTableCode" | "refFieldCode" | "refDisplayFieldCode" | "createdCustomed" | "species" | "editable"
export type IForeignKeyShowKey = "id" | "fieldCode" | "fieldName" | "refTableCode" | "refFieldCode" | "refDisplayFieldCode" | "createdCustomed" | "species" | "editable"
/** 外键设置 */
export type IStrategy = "RESTRICT" | "CASCADE" | "SET_NULL" | "NO_ACTION";
export interface IForeignKey extends IRef {
  deleteStrategy: IStrategy
  updateStrategy: IStrategy
}
export type IReference = IRef

export interface IEditableRecord {
  editable: boolean
}
/** 整表数据 */
export interface ITableInfoPlus {
  name: string
  code: string
  type: ITableType
  moduleId: string
  species: string
}
export interface ITableInfoFromApi extends ITableInfoPlus {
  id: string
  auxTable: IAuxTableInfo
  treeTable: ITreeTableInfo
  references: IReference[]
  foreignKeys: IForeignKey[]
  relationTables: IRelatedPage[]
  columns: ITableColumnFromApi[]
}
export interface ITableInfo extends ITableInfoPlus {
  mainTableName?: string
  mainTableCode?: string
  maxLevel?: number
  references: IReference[]
  foreignKeys: IForeignKey[]
  relatedPages: IRelatedPage[]
  columns: ITableColumn[],
  tableId: string
}
