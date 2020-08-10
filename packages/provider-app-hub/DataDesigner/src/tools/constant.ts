/*
 * @Author: wph
 * @Date: 2020-07-22 09:23:52
 * @LastEditTime: 2020-08-10 18:10:31
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
