/*
 * @Author: wph
 * @Date: 2020-07-22 09:23:52
 * @LastEditTime: 2020-08-12 17:40:39
 * @LastEditors: Please set LastEditors
 * @Description: 权限功能单元与页面状态无关的方法
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\AuthManager\src\features\authItem\authItem.ts
 */
/**
 * 与后端协商,不涉及动态改变的下拉选项存在前端,不用接口请求
 */
/**
 * 表类型枚举
*/
interface ITableType{
  value:"normalTable" | "tree" | "auxTable";
  text:"普通表"|"树形表"|"附属表";
}

/**
 * 表类型枚举
 */
export const TableTypeEnum :Array<ITableType> = [
  { value: "normalTable", text: "普通表" },
  { value: "tree", text: "树形表" },
  { value: "auxTable", text: "附属表" }
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
