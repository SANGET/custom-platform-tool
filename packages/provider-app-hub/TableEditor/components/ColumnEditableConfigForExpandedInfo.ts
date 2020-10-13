import {
  SPECIES, COLUMNS_KEY, DATATYPE, FIELDTYPE
} from '../constants';

const isRecordBis = (species) => {
  return ![SPECIES.SYS, SPECIES.SYS_TMPL, SPECIES.BIS_TMPL].includes(species);
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
    const flag = record.createdCustomed;
    return flag;
  },
  /** 字段类型 */
  [COLUMNS_KEY.FIELDTYPE]: (form) => {
    /** 非用户自定义生成的字段允许修改字段类型 */
    const flag = isRecordBis(form.getFieldValue(COLUMNS_KEY.SPECIES))
    && ![DATATYPE.QUOTE, DATATYPE.FK].includes(form.getFieldValue(COLUMNS_KEY.DATATYPE));
    return flag;
  },
  /** 数据类型 */
  [COLUMNS_KEY.DATATYPE]: (form) => {
    /** 系统生成的字段不允许改动 */
    const flag = isRecordBis(form.getFieldValue(COLUMNS_KEY.SPECIES));
    return flag;
  },
  /** 长度 */
  [COLUMNS_KEY.FIELDSIZE]: (form) => {
    const species = form.getFieldValue(COLUMNS_KEY.SPECIES);
    const fieldType = form.getFieldValue(COLUMNS_KEY.FIELDTYPE);
    const dataType = form.getFieldValue(COLUMNS_KEY.DATATYPE);
    /** 非自动生成的业务字段允许修改长度 */
    const flag = isRecordBis(species)
    /** 字段类型为字符串，且数据类型为 图片，视频，音频，文件时，不允许改动 */
    && !(
      ([FIELDTYPE.STRING].includes(fieldType)
    && [DATATYPE.IMG, DATATYPE.VIDEO, DATATYPE.VIDEO, DATATYPE.FILE].includes(dataType))
    /** 字段类型为日期，且数据类型为 主键，引用，附件，空时，不允许改动 */
    || ([FIELDTYPE.DATE].includes(fieldType)
    && [DATATYPE.PK, DATATYPE.QUOTE, DATATYPE.FK, DATATYPE.NORMAL].includes(dataType))
    );
    return flag;
  },
  /** 小数点 */
  [COLUMNS_KEY.DECIMALSIZE]: (form) => {
    /** 系统生成的字段不允许改动 */
    const flag = ![SPECIES.SYS, SPECIES.SYS_TMPL].includes(form.getFieldValue(COLUMNS_KEY.SPECIES))
    /** 字段类型为整型时才允许改动 */
     && [FIELDTYPE.INT].includes(form.getFieldValue(COLUMNS_KEY.FIELDTYPE));
    return flag;
  },
  /** 必填 */
  [COLUMNS_KEY.REQUIRED]: (form) => {
    /** 系统生成的字段不允许改动 */
    return ![SPECIES.SYS, SPECIES.SYS_TMPL].includes(form.getFieldValue(COLUMNS_KEY.SPECIES));
  },
  /** 唯一 */
  [COLUMNS_KEY.UNIQUE]: (form) => {
    /** 系统生成的字段不允许改动 */
    return [SPECIES.BIS, SPECIES.BIS_TMPL].includes(form.getFieldValue(COLUMNS_KEY.SPECIES))
    /** 数据类型为主键或空时，才允许改动 */
     && [DATATYPE.NORMAL, DATATYPE.PK].includes(form.getFieldValue(COLUMNS_KEY.DATATYPE));
    // return flag;
  },
  /** 字典 */
  [COLUMNS_KEY.DICTIONARYFOREIGN]: (form) => {
    /** 系统生成的字段不允许改动 */
    const flag = [SPECIES.BIS, SPECIES.BIS_TMPL].includes(form.getFieldValue(COLUMNS_KEY.SPECIES))
    /** 数据类型为字典时，才允许改动 */
    && [DATATYPE.DICT].includes(form.getFieldValue(COLUMNS_KEY.DATATYPE));
    return flag;
  },
  /** 转换成拼音 */
  [COLUMNS_KEY.PINYINCONVENT]: (form) => {
    /** 字段类型为字符串且数据类型为空或主键时，允许改动 */
    const flag = [FIELDTYPE.STRING].includes(form.getFieldValue(COLUMNS_KEY.FIELDTYPE))
    && [DATATYPE.PK, DATATYPE.NORMAL].includes(form.getFieldValue(COLUMNS_KEY.DATATYPE));
    return flag;
  },
  /** 编码规则 */
  [COLUMNS_KEY.REGULAR]: () => {
    return false;
  }
};
export { fieldEditableConfig };
