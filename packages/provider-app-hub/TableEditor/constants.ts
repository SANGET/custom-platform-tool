import { IDataType, ISpecies, ISELECTSMENU } from './interface';

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

export const TABLE_TYPE_OPTIONS = [
  { label: '普通表', value: 'TABLE', key: 'TABLE' },
  { label: '附属表', value: 'AUX_TABLE', key: 'AUX_TABLE' },
  { label: '树形表', value: 'TREE', key: 'TREE' }
];
export enum TABLE_TYPE {
  /** 普通表 */
  "TABLE" = "TABLE",
  /** 树形表 */
  "TREE" = "TREE",
  /** 附属表 */
  "AUX_TABLE" = "AUX_TABLE"
}

export enum MENUS_TYPE {
  /** 模块 */
  "MODULE",
  /** 页面 */
  "PAGE"
}

export enum DESCRIPTION_SIZE {
  "SMALL" = "s"
}

export enum BUTTON_TYPE {
  "PRIMARY" = "primary"
}
export enum BUTTON_SIZE {
  "LARGE" = "large",
  "MIDDLE" = "middle",
  "SMALL" = "small"
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
export const SPECIES = {
  /** 系统元数据 */
  SYS: ISpecies.SYS,
  /** 业务元数据 */
  BIS: ISpecies.BIS,
  /** 系统元数据 */
  SYS_TMPL: ISpecies.SYS_TMPL,
  /** 业务元数据 */
  BIS_TMPL: ISpecies.BIS_TMPL
};
export const DATATYPE = {
  /** 普通字段 */
  NORMAL: IDataType.NORMAL,
  /** 主键字段 */
  PK: IDataType.PK,
  /** 引用字段 */
  QUOTE: IDataType.QUOTE,
  /** 字典字段 */
  DICT: IDataType.DICT,
  /** 外键字段 */
  FK: IDataType.FK,
  /** 图片 */
  IMG: IDataType.IMG,
  /** 视频 */
  VIDEO: IDataType.VIDEO,
  /** 音频 */
  AUDIO: IDataType.AUDIO,
  /** 文件 */
  FILE: IDataType.FILE
};
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

export const FIELDTYPEMENU: ISELECTSMENU[] = [
  {
    label: "字符串",
    key: "STRING",
    value: "STRING"
  }, {
    label: "数字",
    key: "INT",
    value: "INT"
  }, {
    label: "时间",
    key: "TIME",
    value: "TIME"
  }, {
    label: "日期",
    key: "DATE",
    value: "DATE"
  }, {
    label: "日期时间",
    key: "DATE_TIME",
    value: "DATE_TIME"
  }, {
    label: "超大文本",
    key: "TEXT",
    value: "TEXT"
  }, {
    label: "长整型",
    key: "LONG",
    value: "LONG"
  }
];
export const FIELDSIZEREGULAR = {
  STRING: {
    DEFAULT: 32,
    MAXREG: /^([0-9]\d?|1[0-1]\d|12[0-8])$/,
    MAX: 128
  },
  INT: {
    DEFAULT: 8,
    MAXREG: /^(1?\d|20)$/,
    MAX: 20
  },
  DATE_TIME: {
    DEFAULT: 0,
    MAXREG: /^[0-4]$/,
    MAX: 4
  },
  TIME: {
    DEFAULT: 0,
    MAXREG: /^[0-4]$/,
    MAX: 4
  },
  TEXT: {
    DEFAULT: 100,
    MAXREG: /^([1-5]?\d{0,3}[0-9]|6[0-4]\d{0,3}|654\d{0,2}|655[0-2]\d|6553[0-5])$/,
    MAX: 65535
  }
};
export const DATATYPEMENU = {
  STRING: [
    {
      label: " ",
      key: "NORMAL",
      value: "NORMAL",
    }, {
      label: "主键",
      key: "PK",
      value: "PK"
    }, {
      label: "引用",
      key: "QUOTE",
      value: "QUOTE"
    }, {
      label: "字典",
      key: "DICT",
      value: "DICT"
    }, {
      label: "外键",
      key: "FK",
      value: "FK"
    }, {
      label: "图片",
      key: "IMG",
      value: "IMG"
    }, {
      label: "视频",
      key: "VIDEO",
      value: "VIDEO"
    }, {
      label: "音频",
      key: "AUDIO",
      value: "AUDIO"
    }, {
      label: "文件",
      key: "FILE",
      value: "FILE"
    }
  ],
  INT: [
    {
      label: " ",
      key: "NORMAL",
      value: "NORMAL",
    }, {
      label: "主键",
      key: "PK",
      value: "PK"
    }, {
      label: "引用",
      key: "QUOTE",
      value: "QUOTE"
    }, {
      label: "外键",
      key: "FK",
      value: "FK"
    }
  ],
  DATE: [
    {
      label: " ",
      key: "NORMAL",
      value: "NORMAL",
    }, {
      label: "主键",
      key: "PK",
      value: "PK"
    }, {
      label: "引用",
      key: "QUOTE",
      value: "QUOTE"
    }, {
      label: "外键",
      key: "FK",
      value: "FK"
    }
  ],
  DATE_TIME: [
    {
      label: " ",
      key: "NORMAL",
      value: "NORMAL",
    }, {
      label: "主键",
      key: "PK",
      value: "PK"
    }, {
      label: "引用",
      key: "QUOTE",
      value: "QUOTE"
    }, {
      label: "外键",
      key: "FK",
      value: "FK"
    }
  ],
  TIME: [
    {
      label: " ",
      key: "NORMAL",
      value: "NORMAL",
    }, {
      label: "主键",
      key: "PK",
      value: "PK"
    }, {
      label: "引用",
      key: "QUOTE",
      value: "QUOTE"
    }, {
      label: "外键",
      key: "FK",
      value: "FK"
    }
  ],
  TEXT: [
    {
      label: " ",
      key: "NORMAL",
      value: "NORMAL"
    }
  ]
};
export const DATATYPEMENUFORTEXT = [
  {
    label: " ",
    key: "NORMAL",
    value: "NORMAL",
  }, {
    label: "主键",
    key: "PK",
    value: "PK"
  }, {
    label: "引用",
    key: "QUOTE",
    value: "QUOTE"
  }, {
    label: "字典",
    key: "DICT",
    value: "DICT"
  }, {
    label: "外键",
    key: "FK",
    value: "FK"
  }, {
    label: "图片",
    key: "IMG",
    value: "IMG"
  }, {
    label: "视频",
    key: "VIDEO",
    value: "VIDEO"
  }, {
    label: "音频",
    key: "AUDIO",
    value: "AUDIO"
  }, {
    label: "文件",
    key: "FILE",
    value: "FILE"
  }
];

export const VALUEBOOLEANMENU: ISELECTSMENU[] = [
  {
    label: '是',
    key: 'true',
    value: 'true'
  }, {
    label: '否',
    key: 'false',
    value: 'false'
  }
];
export enum SPECIESCN {
  /** 系统元数据 */
  "SYS" = "系统",
  /** 业务元数据 */
  "BIS" = "业务",
  /** 系统元数据 */
  "SYS_TMPL" = "系统",
  /** 业务元数据 */
  "BIS_TMPL" = "业务"
}
export enum REFERENCES_KEY {
  'INDEX' = 'index',
  'FIELDNAME' = 'fieldName',
  'FIELDCODE' = 'fieldCode',
  'FIELDID' = 'fieldId',
  'REFTABLECODE' = 'refTableCode',
  'REFTABLEID' = 'refTableId',
  'REFFIELDCODE' = 'refFieldCode',
  'REFFIELDTYPE' = 'refFieldCode_fieldType',
  'REFFIELDSIZE' = 'refFieldCode_fieldSize',
  'REFFIELDNAME' = 'refFieldCode_fieldName',
  'REFDISPLAYCODE' = 'refDisplayFieldCode',
  'ID' = 'id',
  'SPECIES' = 'species',
  'EDITABLE' = 'editable',
  'CREATEDCUSTOMED' = 'createdCustomed'
}
export enum FOREIGNKEYS_KEY {
  'INDEX' = 'index',
  'FIELDNAME' = 'fieldName',
  'FIELDCODE' = 'fieldCode',
  'FIELDID' = 'fieldId',
  'REFTABLECODE' = 'refTableCode',
  'REGTABLEID' = 'refTableId',
  'REFTABLEID' = 'refTableId',
  'REFFIELDCODE' = 'refFieldCode',
  'REFFIELDTYPE' = 'refFieldCode_fieldType',
  'REFFIELDSIZE' = 'refFieldCode_fieldSize',
  'REFFIELDNAME' = 'refFieldCode_fieldName',
  'REFDISPLAYCODE' = 'refDisplayFieldCode',
  'ID' = 'id',
  'SPECIES' = 'species',
  'EDITABLE' = 'editable',
  'DELETESTRATEGY' = 'deleteStrategy',
  'UPDATESTRATEGY' = 'updateStrategy',
  'CREATEDCUSTOMED' = 'createdCustomed',
}

export enum ROW_SELECT_TYPE {
  RADIO = 'radio',
  CHECKBOX='checkbox'
}

export const MESSAGES = {
  MAY_I_DELETE: "是否确认删除？",
  GETTABLEINFO_FAILED: "查询表数据失败，请联系技术人员",
  GETMENULIST_FAILED: "查询模块列表数据失败，请联系技术人员",
  GETDICTIONARYLIST_FAILED: "查询字典列表数据失败，请联系技术人员",
  GETTABLELIST_FAILED: "查询表列表数据失败，请联系技术人员",
  DELETEFIELD_FAILED: "删除字段失败，请联系技术人员"
};
