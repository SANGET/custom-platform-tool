import {
  REFERENCES_KEY, SPECIES
} from './constant';

const isCustomed = (species) => {
  return ![SPECIES?.SYS, SPECIES?.SYS_TMPL, SPECIES?.BIS_TMPL].includes(species);
};
/** 字段的实时可编辑配置 */
const columnEditConfig = {
  [REFERENCES_KEY?.FIELDNAME]: (form) => {
    /** 非用户自定义生成的字段允许修改字段名称 */
    const flag = isCustomed(form.getFieldValue(REFERENCES_KEY?.SPECIES));
    return flag;
  },
  [REFERENCES_KEY?.FIELDCODE]: () => {
    return false;
  },
  [REFERENCES_KEY?.REFTABLECODE]: (form) => {
    /** 非用户自定义生成的字段允许修改表名 */
    const flag = isCustomed(form.getFieldValue(REFERENCES_KEY?.SPECIES));
    return flag;
  },
  [REFERENCES_KEY?.REFFIELDCODE]: (form) => {
    /** 非用户自定义生成的字段允许修改表名 */
    const flag = isCustomed(form.getFieldValue(REFERENCES_KEY?.SPECIES));
    return flag;
  },
  [REFERENCES_KEY?.REFDISPLAYCODE]: (form) => {
    /** 非用户自定义生成的字段允许修改表名 */
    const flag = isCustomed(form.getFieldValue(REFERENCES_KEY?.SPECIES));
    return flag;
  },
};

export { columnEditConfig };
