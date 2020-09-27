import {
  RE, SPECIES, BUTTON_TYPE, BUTTON_SIZE, NOTIFICATION_TYPE, API_SUCESS_CODE, API_ERROR_MSG
} from '../../constant';
import { ISELECTSMENU, IDataType } from '../../interface';

export {
  RE, SPECIES, BUTTON_TYPE, BUTTON_SIZE, NOTIFICATION_TYPE, API_SUCESS_CODE, API_ERROR_MSG
};

export const REPLUS = {
  /** 中文、英文、数字、下划线、括号 */
  CENUSB: /^[a-zA-Z0-9_()\u4e00-\u9fa5]{1,32}$/,
  /** 非数字，下划线开头 */
  NONUF: /^[^_\d]/,
  /** 输入0-8 */
  ZE: /^[0-8]$/,
  /** 英文小写、数字、下划线 */

  ENUS: /^[a-z0-9_A-Z]{1,64}$/
};

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
  "PINYINCONVERT" = "pinyinConvert",
  /** 编码规则 */
  "REGULAR" = "regular",
  /** 分类 */
  "SPECIES" = "species",
  "EDITABLE" = "editable",
  "CREATEDCUSTOMED" = "createdCustomed"
}
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
  }
];
export const FIELDTYPEMENUFORTEXT: ISELECTSMENU[] = [
  {
    label: "字符串",
    key: "STRING",
    value: "STRING"
  }, {
    label: "数字",
    key: "INT",
    value: "INT"
  }, {
    label: "长整型",
    key: "LONG",
    value: "LONG"
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
  }
];

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
