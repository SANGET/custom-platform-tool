/** 表名+字段id分割 */
export const TABLE_PATH_SPLIT_MARK = '.';

/** 数据源的元数据 AOP/util */
const datasoruceMetaRegExp = /^@\(meta\)\./;

export const isPageDatasoruceMeta = (text: string) => datasoruceMetaRegExp.test(text);
export const pickDatasoruceMetaKeyWord = (text:string) => text.replace(datasoruceMetaRegExp, '') || text;
