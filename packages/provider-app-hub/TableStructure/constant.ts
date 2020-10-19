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
    title: "复制",
    behavior: "onClick",
  },
  {
    operate: "relation",
    title: "表关系图",
    behavior: "onClick"
  }
];

export enum TABLE_TYPE {
  /** 普通表 */
  "TABLE" = "TABLE",
  /** 树形表 */
  "TREE" = "TREE",
  /** 附属表 */
  "AUX_TABLE" = "AUX_TABLE"

}
export const TABLE_OPTIONS: ITableType[] = [
  {
    value: "TABLE",
    title: "普通表"
  }, {
    value: "TREE",
    title: "树形表"
  }, {
    value: "AUX_TABLE",
    title: "附属表"
  }
];
export const TABLE_VALUE_ENUM: IValueEnum = {
  TABLE: { text: "普通表" },
  TREE: { text: "树形表" },
  AUX_TABLE: { text: "附属表" }
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
    title: '数据表名称',
    dataIndex: 'name',
    width: 140,
    ellipsis: true,
  },
  {
    title: '数据表编码',
    dataIndex: 'code',
    width: 140,
    hideInSearch: true,
    ellipsis: true,
  },
  {
    title: '表类型',
    dataIndex: 'type',
    width: 100,
    valueEnum: TABLE_VALUE_ENUM,
    ellipsis: true,
  },
  {
    title: '归属模块',
    dataIndex: 'moduleName',
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

  ENUS: /^[a-z][a-z0-9_]{0,39}$/,

  /** 去除括号 */

  BRACKETS: /[(|)]|[（|）]/g,

  /** 中文、英文、数字，不支持特殊字符 */

  CEN: /^[\u4E00-\u9FA5A-Za-z0-9]+$/
};
