import {
  SPECIES, COLUMNS_KEY, DATATYPE, FIELDTYPE, FOREIGNKEYS_KEY
} from '../constants';

const isRecordBis = (species) => {
  return [SPECIES.BIS].includes(species);
};
/** 列是否可编辑映射 */
const fieldEditableConfig = {
  /** 字段名称 */
  [COLUMNS_KEY.NAME]: () => {
    return true;
  },
  /** 字段编码 */
  [COLUMNS_KEY.CODE]: (form, record) => {
    /** 只有用户自定义的字段才允许修改字段编码 */
    const amICreatedCustomed = record.createdCustomed;
    return amICreatedCustomed;
  },
  /** 字段类型 */
  [COLUMNS_KEY.FIELDTYPE]: (form) => {
    const amIBis = isRecordBis(form.getFieldValue(COLUMNS_KEY.SPECIES));
    const amIReference = [DATATYPE.QUOTE, DATATYPE.FK].includes(form.getFieldValue(COLUMNS_KEY.DATATYPE));
    /** 非用户自定义生成的字段允许修改字段类型 */
    return amIBis && !amIReference;
  },
  /** 数据类型 */
  [COLUMNS_KEY.DATATYPE]: (form) => {
    /** 系统生成的字段不允许改动 */
    const amICreatedCustomed = isRecordBis(form.getFieldValue(COLUMNS_KEY.SPECIES));
    return amICreatedCustomed;
  },
  /** 长度 */
  [COLUMNS_KEY.FIELDSIZE]: (form) => {
    const amIBis = isRecordBis(form.getFieldValue(COLUMNS_KEY.SPECIES));
    const fieldType = form.getFieldValue(COLUMNS_KEY.FIELDTYPE);
    const dataType = form.getFieldValue(COLUMNS_KEY.DATATYPE);
    const amIString = [FIELDTYPE.STRING].includes(fieldType);
    const amIDate = [FIELDTYPE.DATE].includes(fieldType);
    const amIBigFile = [DATATYPE.IMG, DATATYPE.VIDEO, DATATYPE.AUDIO, DATATYPE.FILE].includes(dataType);
    const amIBasicData = [DATATYPE.PK, DATATYPE.QUOTE, DATATYPE.FK, DATATYPE.NORMAL].includes(dataType);
    /** 非自动生成的业务字段允许修改长度
     * 字段类型为字符串，且数据类型为 图片，视频，音频，文件时，不允许改动
     * 字段类型为日期，且数据类型为 主键，引用，附件，空时，不允许改动 */
    const flag = amIBis && !((amIString && amIBigFile) || (amIDate && amIBasicData));
    return flag;
  },
  /** 小数点 */
  [COLUMNS_KEY.DECIMALSIZE]: (form) => {
    const amIBis = [SPECIES.BIS, SPECIES.BIS_TMPL].includes(form.getFieldValue(COLUMNS_KEY.SPECIES));
    const amIInt = [FIELDTYPE.INT].includes(form.getFieldValue(COLUMNS_KEY.FIELDTYPE));
    /** 系统生成的字段不允许改动
    * 字段类型为整型时才允许改动 */
    const flag = amIBis && amIInt;
    return flag;
  },
  /** 必填 */
  [COLUMNS_KEY.REQUIRED]: (form) => {
    const amIBis = [SPECIES.BIS, SPECIES.BIS_TMPL].includes(form.getFieldValue(COLUMNS_KEY.SPECIES));
    /** 系统生成的字段不允许改动 */
    return amIBis;
  },
  /** 唯一 */
  [COLUMNS_KEY.UNIQUE]: (form) => {
    const amIBis = [SPECIES.BIS, SPECIES.BIS_TMPL].includes(form.getFieldValue(COLUMNS_KEY.SPECIES));
    const normalOrFk = [DATATYPE.NORMAL, DATATYPE.PK].includes(form.getFieldValue(COLUMNS_KEY.DATATYPE));
    /** 系统生成的字段不允许改动
     * 数据类型为主键或空时，才允许改动 */
    return amIBis && normalOrFk;
  },
  /** 字典 */
  [COLUMNS_KEY.DICTIONARYFOREIGN]: (form) => {
    const amIBis = [SPECIES.BIS, SPECIES.BIS_TMPL].includes(form.getFieldValue(COLUMNS_KEY.SPECIES));
    const amIDict = [DATATYPE.DICT].includes(form.getFieldValue(COLUMNS_KEY.DATATYPE));
    /** 系统生成的字段不允许改动
     * 数据类型为字典时，才允许改动 */
    return amIBis && amIDict;
  },
  /** 转换成拼音 */
  [COLUMNS_KEY.PINYINCONVENT]: (form) => {
    const amIString = [FIELDTYPE.STRING].includes(form.getFieldValue(COLUMNS_KEY.FIELDTYPE));
    const normalOrFk = [DATATYPE.NORMAL, DATATYPE.PK].includes(form.getFieldValue(COLUMNS_KEY.DATATYPE));
    /** 字段类型为字符串且数据类型为空或主键时，允许改动 */
    return amIString && normalOrFk;
  },
  /** 编码规则 */
  [COLUMNS_KEY.REGULAR]: () => {
    return false;
  }
};

/** 字段的实时可编辑配置 */
const referenceEditableConfig = {
  [FOREIGNKEYS_KEY.FIELDNAME]: (form) => {
    /** 非用户自定义生成的字段允许修改字段名称 */
    const amIBis = isRecordBis(form.getFieldValue(FOREIGNKEYS_KEY.SPECIES));
    return amIBis;
  },
  [FOREIGNKEYS_KEY.FIELDCODE]: () => {
    return false;
  },
  [FOREIGNKEYS_KEY.REFTABLECODE]: (form) => {
    /** 非用户自定义生成的字段允许修改表名 */
    const amIBis = isRecordBis(form.getFieldValue(FOREIGNKEYS_KEY.SPECIES));
    return amIBis;
  },
  [FOREIGNKEYS_KEY.REFFIELDCODE]: (form) => {
    return true;
  },
  [FOREIGNKEYS_KEY.REFDISPLAYCODE]: (form) => {
    return true;
  },
  [FOREIGNKEYS_KEY.UPDATESTRATEGY]: (form) => {
    return true;
  },
  [FOREIGNKEYS_KEY.DELETESTRATEGY]: (form) => {
    return true;
  },
};
export { fieldEditableConfig, referenceEditableConfig };
