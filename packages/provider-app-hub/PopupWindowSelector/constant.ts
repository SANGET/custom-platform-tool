import { ProColumns } from '@hy/pro-table';
import { IOperationalMenuItem, IValueEnum, ITableType } from './interface';

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
    operate: "edit",
    title: "编辑",
    behavior: "link"
  },
  {
    operate: "delete",
    title: "删除",
    behavior: "popconfirm"
  }, {
    operate: "copy",
    title: "预览",
    behavior: "onClick",
  },
  {
    operate: "relation",
    title: "表关系图",
    behavior: "onClick"
  }
];

export enum SHOW_TYPE {
  /** 表 */
  "TABLE" = "TABLE",
  /** 树 */
  "TREE" = "TREE",
  /** 左树右表 */
  "LEFT_TREE_RIGHT_TABLE" = "LEFT_TREE_RIGHT_TABLE",

  /** 自定义 */
  "CUSTOMIZATION" = "CUSTOMIZATION",

}

export enum SELECT_TYPE {
  /** 单选 */
  "SINGLE" = "SINGLE",
  /** 多选 */
  "MULTIPLE" = "MULTIPLE",

}

export const SHOW_TYPE_OPTIONS: ITableType[] = [
  {
    value: "TABLE",
    title: "表格"
  }, {
    value: "TREE",
    title: "树形"
  }, {
    value: "LEFT_TREE_RIGHT_TABLE",
    title: "左树右表"
  }, {
    value: "CUSTOMIZATION",
    title: "自定义"
  }
];
export const SELECT_TYPE_OPTIONS: ITableType[] = [
  {
    value: "SINGLE",
    title: "多选"
  }, {
    value: "MULTIPLE",
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
    title: '弹窗选择标题',
    dataIndex: 'name',
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
