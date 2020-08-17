/*
 * @Author: your name
 * @Date: 2020-08-15 11:59:39
 * @LastEditTime: 2020-08-16 17:17:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\DataDesigner\src\tools\reg.ts
 */
const REG = {
  /** 正整数 */
  plusInt: /^\+?[1-9][0-9]*$/,
  /** 可以为中文、英文、数字、下划线、括号 */
  znEnNum: /^[\u4e00-\u9fa5_a-zA-Z0-9()]+$/
};

export default REG;
