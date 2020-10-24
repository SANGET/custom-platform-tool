export type IStatus = "success" | "info" | "warning" | "error"

export enum IOperationalMenuItemKeys {
  operate = '_operate',
  title = '_title',
  behavior = '_behavior',

}
export enum OperationalOperate {
  edit = 'edit',
  delete = 'delete',
  preview = 'preview'

}

export enum OperationalBehavior {
  popconfirm = 'popconfirm'

}
export interface IOperationalMenuItem {
  [IOperationalMenuItemKeys.operate]: string;
  [IOperationalMenuItemKeys.behavior]: string; // TODO: enum
  [IOperationalMenuItemKeys.title]: string;
}

export interface IValueEnum {
  [key: string]: React.ReactNode | {
    text: React.ReactNode;
    status?: 'Success' | 'Error' | 'Processing' | 'Warning' | 'Default';
  };
}

export interface IPopupShowType {
  id: number;
  title: string;
}

export interface IPopupSelectType {
  id: number;
  title: string;
}

export interface ITableType {
  title: string;
  value: string;
}

/** 表类型 */
// export type ITableType = "TABLE" | "TREE" | "AUX_TABLE"
/** 关联页面 */
interface IRelatedPageFromApi {
  id: string
  name: string
}
/** 引用 */
export interface IReferenceFromApi {
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
/** 外键 */
type IStrategy = "RESTRICT" | "CASCADE" | "SET_NULL" | "NO_ACTION";
export interface IForeignKeyFromApi extends IReferenceFromApi {
  deleteStrategy: IStrategy
  updateStrategy: IStrategy
}

/** 表字段信息：字段类型（字符串，整型，长整型，时间，日期，日期时间，超大文本） */
type IFieldType = "STRING" | "INT" | "LONG" | "TIME" | "DATE" | "DATE_TIME" | "TEXT"
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
// export type ISpecies = "SYS" | "BIS" | "SYS_TMPL" | "BIS_TMPL"
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
/** 表字段信息：其他信息（必填，唯一，转换成拼音，校验规则 */
interface IFieldProperty {
  required: boolean
  unique: boolean
  pinyinConvent: boolean
}
/** 字段 */
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
/** 接口返回的表数据 */
export interface ITableInfoFromApi {
  name: string
  code: string
  type: ITableType
  moduleId: string
  species: string
  id: string
  auxTable: {
    parentTable: ITableInfoFromApi
  }
  treeTable: {
    maxLevel: number
  }
  references: IReferenceFromApi[]
  foreignKeys: IForeignKeyFromApi[]
  relationTables: IRelatedPageFromApi[]
  columns: ITableColumnFromApi[]
}

export interface ITableColumnInState extends ITableColumnFromApi {
  createdCustomed: boolean
  editable: boolean
  dictionary: string
  dictionaryCn: string
  pinyinConvent: boolean
  required: boolean
  unique: boolean
}

export interface ITableInfoInState {
  basicInfo: {
    tableId: string
    /** 表名 */
    tableName: string,
    /** 编码 */
    tableCode: string,
    /** 表类型 */
    tableType: ITableType,
    /** 所属模块 */
    relatedModuleId: string,
    /** 主表编码（表类型为附属表时起作用 */
    mainTableCode: string,
    /** 主表名（表类型为附属表时起作用 */
    mainTableName: string,
    /** 最大层级（表类型为树形表时起作用 */
    maxLevel: number,
    /** 表创建类型 */
    species: ISpecies,
  },
  /** 关联页面 */
  relatedPages: IRelatedPageFromApi[],
  /** 表扩展信息 */
  /** 字段列表 */
  fieldList: ITableColumnInState[],
  /** 引用字段列表 */
  referenceList: IReferenceFromApi[],
  /** 外键字段列表 */
  foreignKeyList: IForeignKeyFromApi[],
  /** 扩展信息中的编辑行标识 */
  editingKeyInExpandedInfo: string
  /** 扩展信息中的编辑行所在区域 */
  activeAreaInExpandedInfo: string
  /** 是否显示系统字段 */
  showSysFields: boolean
  /** 字典弹窗需要回写的字典id数据 */

  dictIdsShowInModal: string[]
  /** 是否显示字典弹窗 */
  visibleModalChooseDict: boolean
  /** 是否显示引用字段弹窗 */
  visibleModalCreateReference:boolean
  /** 是否显示引用字段弹窗 */
  visibleModalCreateForeignKey: boolean
}
export type ITableColumnShowKey = "id" | "name" | "code" | "fieldType" | "dataType" | "fieldSize" | "decimalSize" | "species" | "required" | "unique" | "dictionaryForeign"|"pinyinConvent"
export interface ISELECTSMENU {
  label: string
  key: string
  value: string
}

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
export type IPopupWindowShowKey = "returnText" | "returnValue" | "showColumn"
export type IReferenceShowKey = "id" | "fieldCode" | "fieldName" | "refTableCode" | "refFieldCode" | "refDisplayFieldCode" | "createdCustomed" | "species" | "editable"
export type IForeignKeyShowKey = "id" | "fieldCode" | "fieldName" | "refTableCode" | "refFieldCode" | "refDisplayFieldCode" | "createdCustomed" | "species" | "editable" | "updateStrategy" | "deleteStrategy"
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
