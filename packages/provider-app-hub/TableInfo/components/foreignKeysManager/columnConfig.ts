import {
  FOREIGNKEYS_KEY, SPECIES
} from './constant';

const isCustomed = (species) => {
  return ![SPECIES?.SYS, SPECIES?.SYS_TMPL, SPECIES?.BIS_TMPL].includes(species);
};
/** 字段的实时可编辑配置 */
const columnEditConfig = {
  [FOREIGNKEYS_KEY.FIELDNAME]: (form) => {
    /** 非用户自定义生成的字段允许修改字段名称 */
    const flag = isCustomed(form.getFieldValue(FOREIGNKEYS_KEY.SPECIES));
    return flag;
  },
  [FOREIGNKEYS_KEY.FIELDCODE]: () => {
    return false;
  },
  [FOREIGNKEYS_KEY.REFTABLECODE]: (form) => {
    /** 非用户自定义生成的字段允许修改表名 */
    const flag = isCustomed(form.getFieldValue(FOREIGNKEYS_KEY.SPECIES));
    return flag;
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

export { columnEditConfig };
