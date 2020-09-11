/**
 * ts正则匹配
 * https://github.com/Microsoft/TypeScript/issues/6579
 * type Integer(n:number) => String(n).macth(/^[0-9]+$/)
 * let x:Integer = 3 //OK
 * let y:Integer = 3.6 //wrong
 */

export enum ApbFunction {
  /** 插入 */
  SET = 'TABLE_INSERT',
  /** 更新 */
  UPD = 'TABLE_UPDATE',
  /** 删除 */
  DEL = 'TABLE_DELETE',
  /** 查表 */
  SELECT = 'TABLE_SELECT',
  /** 上传 */
  UPLOAD = 'UPLOAD',
  /** 下载 */
  DOWN = 'DOWNLOAD',
  /** 导入 */
  IMPORT = 'IMPORT_DATA',
  /** 导出 */
  EXPORT = 'EXPORT_TO_FILE',
  /** 自定义返回 */
  RESULT = 'RESULT_RESOLVER'
  /** 第三方业务... 扩展自定义的 */
}

// 变量 jsonPath

// 条件
export enum ConditionSymbol {
  OR = 'or',
  AND = 'and'
}

// [greaterEqu, or, in, like, notBetween, startNotWith, equ,
//  less, empty, notEqu, notLike, lessEqu, and, notIn, notEmpty, greater, startWith, between]
export enum ConditionalOperator {
  EQU = 'equ', // =
  N_EQU = 'not_equ', // <>
  GERATER = 'gerater', // >
  LESS = 'less', // <
  GERATER_EQU = 'gerater_equ', // =>
  LESS_EQU = 'less_equ', // <=
  BETWEEN = 'between',
  N_BETTWEEN = 'not_between',
  LIKE = 'like',
  N_LIKE = 'not_like',
  IN = 'in',
  N_IN = 'not_in',
  EMPTY = 'empty',
  N_EMPTY = 'not_empty',
  S_WITH = 'start_with',
  S_N_WITH = 'start_not_with'

}

// {
//   "steps": [
//     {
//       "function": {
//         "code": "TABLE_SELECT",
//         "params": {
//           "table": "haoyun_erp_dept",
//           "condition": {
//             "and": [
//               {
//                 "equ": {
//                   "id": 1299258354992049696
//                 }
//               }
//             ]
//           }
//         }
//       }
//     }
//     ,
//     {
//       "function": {
//         "code": "TABLE_SELECT",
//         "params": {
//           "table": "haoyun_erp_dept",
//           "condition": {
//             "and": [
//               {
//                 "in": {
//                   "id": [1299258354992049696]
//                 }
//               }
//             ]
//           }
//         }
//       }
//     },
//     {
//       "function": {
//         "code": "RESULT_RESOLVER",
//         "params": {
//           "resolver": ["$.steps[0]", "$.steps[1]"]
//         }
//       }
//     }
//   ]
// }
