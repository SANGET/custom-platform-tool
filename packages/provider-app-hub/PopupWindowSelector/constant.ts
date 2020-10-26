import { ProColumns } from '@hy/pro-table';
import { FormInstance } from 'antd/lib/form';
import {
  IOperationalMenuItem, IValueEnum, ITableType, IPopupShowType, IPopupSelectType, IOperationalMenuItemKeys
} from './interface';

export enum API_ERROR_MSG {
  /** 查表详情失败的提示信息 */
  "GETTABLEINFO" = "查询表数据失败，请联系技术人员",
  "ALLOWDELETE" = "查询删除绑定情况失败，请联系技术人员"
}

export enum API_CODE {
  /** 查表详情成功的 code 值 */
  "SUCCESS" = "00000"
}

export enum NOTIFICATION_TYPE {
  /** 成功 */
  "SUCCESS" = "success",
  /** 提示 */
  "INFO" = "info",
  /** 提醒 */
  "WARNING" = "warning",
  /** 失败 */
  "ERROR" = "error"
}
export enum COLUMNS_KEY {
  /** 唯一标识 */
  "ID" = "id",
  /** 序号 */
  "INDEX" = "index",
  /** 字段名称 */
  "NAME" = "name",
  /** 字段编码 */
  "CODE" = "code",
  /** 字段类型 */
  "FIELDTYPE" = "fieldType",
  /** 数据类型 */
  "DATATYPE" = "dataType",
  /** 字段长度 */
  "FIELDSIZE" = "fieldSize",
  /** 小数点长度 */
  "DECIMALSIZE" = "decimalSize",
  /** 必填 */
  "REQUIRED" = "required",
  /** 唯一 */
  "UNIQUE" = "unique",
  /** 字典 */
  "DICTIONARYFOREIGN" = "dictionaryForeign",
  "DICTIONARYFOREIGNCN" = "dictionaryForeignCn",
  /** 转换成拼音 */
  "PINYINCONVENT" = "pinyinConvent",
  /** 编码规则 */
  "REGULAR" = "regular",
  /** 分类 */
  "SPECIES" = "species",
  "EDITABLE" = "editable",
  "CREATEDCUSTOMED" = "createdCustomed"
}

export const MORE_MENU = [{
  title: "表结构模板",
  key: "template"
}, {
  title: "导入表结构",
  key: "import"
}, {
  title: "导出表结构",
  key: "export"
}, {
  title: "字典管理",
  key: "dictionary"
}];
export const SELECT_ALL = "all";
export enum MENUS_TYPE {
  /** 模块 */
  "MODULE",
  /** 页面 */
  "PAGE"
}

export enum SPECIES {
  /** 系统元数据 */
  SYS = "SYS",

  /** 业务元数据 */
  BIS = "BIS",

  /** 系统元数据,允许修改 */
  SYS_TMPL = "SYS_TMPL",

  /** 业务元数据,禁止删除) */
  BIS_TMPL = "BIS_TMPL",

}
export const PAGE_SIZE_OPTIONS: string[] = ["10", "20", "30", "40", "50", "100"];
export const DEFAULT_PAGE_SISE = 10;
/** 表结构管理 table 表 操作选项 */
export const OPERATIONALMENU: IOperationalMenuItem[] = [
  {
    [IOperationalMenuItemKeys.operate]: "edit",
    [IOperationalMenuItemKeys.title]: "编辑",
    [IOperationalMenuItemKeys.behavior]: "link"
  },
  {
    [IOperationalMenuItemKeys.operate]: "delete",
    [IOperationalMenuItemKeys.title]: "删除",
    [IOperationalMenuItemKeys.behavior]: "popconfirm"
  }, {
    [IOperationalMenuItemKeys.operate]: "preview",
    [IOperationalMenuItemKeys.title]: "预览",
    [IOperationalMenuItemKeys.behavior]: "onClick"
  },
  {
    [IOperationalMenuItemKeys.operate]: "relation",
    [IOperationalMenuItemKeys.title]: "表关系图",
    [IOperationalMenuItemKeys.behavior]: "onClick"
  }
];

export enum SHOW_TYPE {
  /** 表 */
  "TABLE" = 1,
  /** 树 */
  "TREE" = 2,
  /** 左树右表 */
  "LEFT_TREE_RIGHT_TABLE" = 3,

  /** 自定义 */
  "CUSTOMIZATION" = 4,

}

export enum SELECT_TYPE {
  /** 单选 */
  "SINGLE" = 1,
  /** 多选 */
  "MULTIPLE" = 2,

}

export const SHOW_TYPE_OPTIONS: IPopupShowType[] = [
  {
    key: 1,
    value: 1,
    label: "表格"
  }, {
    key: 2,
    value: 2,
    label: "树形"
  }, {
    key: 3,
    value: 3,
    label: "左树右表"
  }, {
    key: 4,
    value: 4,
    label: "自定义"
  }
];
export const SELECT_TYPE_OPTIONS: IPopupSelectType[] = [
  {
    id: 2,
    title: "多选"
  }, {
    id: 1,
    title: "单选"
  }
];

// export const TABLE_VALUE_ENUM: IValueEnum = {
//   TABLE: { text: "普通表1" },
//   TREE: { text: "树形表2" },
//   AUX_TABLE: { text: "附属表3" }
// };

export const POPUP_WINDOW_VALUE_ENUM: IValueEnum = {
  TABLE: { text: "表格", value: 1 },
  TREE: { text: "树形" },
  LEFT_TREE_RIGHT_TABLE: { text: "左树右表" },
  CUSTOMIZATION: { text: "自定义" }
};

/** 表结构管理 table columns 不包含操作项 */
export const COLUMNS: ProColumns[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 80,
    hideInSearch: true,
  },
  {
    title: '弹窗选择名称',
    dataIndex: 'name',
    width: 140,
    ellipsis: true,
  },
  {
    title: '弹窗选择标题',
    dataIndex: 'title',
    width: 140,
    ellipsis: true,
  },
  {
    title: '弹窗选择编码',
    dataIndex: 'code',
    width: 140,
    hideInSearch: true,
    ellipsis: true,
  },
  {
    title: '展示类型',
    dataIndex: 'showType',
    width: 100,
    valueEnum: POPUP_WINDOW_VALUE_ENUM,
    ellipsis: true,
  },
  {
    title: '选择方式',
    dataIndex: 'selectType',
    width: 140,
    hideInSearch: true,
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'gmtCreate',
    width: 200,
    hideInSearch: true,
    valueType: 'dateTime',
  },
  {
    title: '状态',
    dataIndex: 'enable',
    width: 200,
    hideInSearch: true,
    valueType: 'dateTime',
  },
  {
    title: '最后修改时间',
    dataIndex: 'gmtModified',
    width: 200,
    hideInSearch: true,
    valueType: 'dateTime',
  },
  {
    title: '最后修改人员',
    dataIndex: 'modifiedUserName',
    width: 140,
    hideInSearch: true,
  },
];

export const RE = {
  /** 中文、英文、数字、下划线、括号 */

  CENUSB: /^(?!_)(?!.*?_$)[a-zA-Z0-9_()\u4e00-\u9fa5]+$/,

  /** 英文小写、数字、下划线 */

  ENUS: /^[a-z][a-z0-9_]{2,44}$/,

  /** 去除括号 */

  BRACKETS: /[(|)]|[（|）]/g,

  /** 中文、英文、数字，不支持特殊字符 */

  CEN: /^[\u4E00-\u9FA5A-Za-z0-9]+$/
};

export interface ISELECTSMENU {
  label: string
  key: string
  value: string
}

export enum FIELDTYPE {
  /** 字符串 */
  "STRING" = "STRING",
  /** 数字 */
  "INT" = "INT",
  /** 长整型 */
  "LONG" = "LONG",
  /** 时间 */
  "TIME" = "TIME",
  /** 日期 */
  "DATE" = "DATE",
  /** 日期时间 */
  "DATE_TIME" = "DATE_TIME",
  /** 超大文本 */
  "TEXT" = "TEXT"
}
export interface IPopupWindow{
  id: string
  code: string
  name : string
  title : string
  showType: string
  selectType: string
  selectCount: string
  enable: string
  tablePopupWindowDetail?: {
    createdBy: string
    datasource: number
    datasourceType: number
    deleteFlag: string
    gmtCreate: string
    gmtModified: string
    id: string
    modifiedBy: string
    returnText: string
    returnValue: string
    showColumn: string
    sortColumnInfo: string
  },
  treePopupWindowDetail?: {
    createdBy: string,
    datasource: number,
    datasourceType: number,
    deleteFlag: string,
    gmtCreate: string,
    gmtModified: string,
    id: string,
    modifiedBy: string,
    relatedSuperiorColumn: string,
    returnText: string,
    returnValue: string,
    showColumn: string,
    showSearch: string,
    sortColumnInfo: string,
    superiorColumn: string
  },

  treeTablePopupWindowDetail: {
    createdBy: string,
    deleteFlag: string,
    gmtCreate: string,
    gmtModified: string,
    id: string,
    modifiedBy: string,
    popupWindowId: string,
    showSearch: string,
    tableDatasource: string,
    tableDatasourceType: string,
    tableReturnText: string,
    tableReturnValue: string,
    tableShowColumn: string,
    tableSortInfo: string,
    tableTreeRelatedColumn: string,
    treeDatasource: string,
    treeDatasourceType: string,
    treeRelatedSuperiorColumn: string,
    treeReturnText: string,
    treeReturnValue: string,
    treeShowColumn: string,
    treeSortInfo: string,
    treeSuperiorColumn: string,
    version: string
  },
  customPopupWindowDetail: {
    createdBy: string,
    deleteFlag: string,
    gmtCreate: string,
    gmtModified: string,
    id: string,
    modifiedBy: string,
    popupWindowId: string

  }
}

export interface IEditPopupWindowProps {
  form?: FormInstance;
  onOk?: () => void;
  onCancel?: () => void;

  updatePopupWindow?: () => void;

  editData:IPopupWindow
  editModalData: IModalData

}

export interface IModalData{
  okText : string
  modalTitle: string
}
