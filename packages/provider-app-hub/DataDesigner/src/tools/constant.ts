/*
 * @Author: wph
 * @Date: 2020-07-22 09:23:52
 * @LastEditTime: 2020-08-27 22:35:03
 * @LastEditors: Please set LastEditors
 * @Description: 权限功能单元与页面状态无关的方法
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\AuthManager\src\features\authItem\authItem.ts
 */
/**
 * 与后端协商,不涉及动态改变的下拉选项存在前端,不用接口请求
 */

/**
 * 是否类型约束
*/
interface IYNType{
  value:"true" | "false" ;
  text:"是"|"否";
}
/**
 * 是否类型枚举
 */
export const YNTypeEnum :Array<IYNType> = [
  { value: "true", text: "是" },
  { value: "false", text: "否" },
];

/**
 * 字段类型约束
*/
interface IDataType{
  value:"NORMAL" | "PK" | "QUOTE"|"DICT"|"FK";
  text:"普通字段"|"主键字段"|"引用字段"|"字典字段"|"外键字段";
}
/**
 * 字段类型枚举
 */
export const DataTypeEnum :Array<IDataType> = [
  { value: "NORMAL", text: "普通字段" },
  { value: "PK", text: "主键字段" },
  { value: "QUOTE", text: "引用字段" },
  { value: "DICT", text: "字典字段" },
  { value: "FK", text: "外键字段" },
];

/**
 * 字段类型约束
*/
interface IFieldType{
  value:"STRING" | "INT" | "TIME"|"DATE"|"DATETIME"|"TEXT"|"BIGINT";
  text:"字符串"|"整型"|"时间"|"日期时间"|"超大文本"|"长整型"|"日期";
}
/**
 * 字段类型枚举
 */
export const FieldTypeEnum :Array<IFieldType> = [
  { value: "STRING", text: "字符串" },
  { value: "INT", text: "整型" },
  { value: "TIME", text: "时间" },
  { value: "DATE", text: "日期" },
  { value: "DATETIME", text: "日期时间" },
  { value: "TEXT", text: "超大文本" },
];

/**
 * 业务字段类型约束
*/
interface ISpeciesType{
  value:"SYS" | "BIS" | "SYS_TMPL" | "BIS_TMPL";
  text:"系统"|"业务"|"系统元数据"|"业务元数据";
}
/**
 * 业务字段类型枚举
 */
export const SpeciesTypeEnum :Array<ISpeciesType> = [
  { value: "SYS", text: "系统" },
  { value: "BIS", text: "业务" },
  { value: "SYS_TMPL", text: "系统元数据" },
  { value: "BIS_TMPL", text: "业务元数据" },
];

/**
 * 表类型枚举
*/
interface ITableType{
  value:"TABLE" | "TREE" | "AUX_TABLE";
  text:"普通表"|"树形表"|"附属表";
}

/**
 * 表类型枚举
 */
export const TableTypeEnum :Array<ITableType> = [
  { value: "TABLE", text: "普通表" },
  { value: "TREE", text: "树形表" },
  { value: "AUX_TABLE", text: "附属表" }
];

/**
* 外键删除/更新策略类型约束
*/
interface IForeignKeyStgy{
  value: "RESTRICT"|"CASCADE"|"SET_NULL"|"NO_ACTION";
  text: '存在关联不允许操作'|'级联'|'置空'|'不处理';
}

/**
 * 外键删除/更新策略枚举
 */
export const ForeignKeyStgyEnum :Array<IForeignKeyStgy> = [
  { value: "RESTRICT", text: "存在关联不允许操作" },
  { value: "CASCADE", text: "级联" },
  { value: "SET_NULL", text: "置空" },
  { value: "NO_ACTION", text: "不处理" },
];
