/**
 * 表达式的处理格式
 *
 * 以下为几个规则：
 *
 * 1. 通过花括号 {} 规定变量边界
 * 2. 通过花括号前的类型定界符来规定变量类型，包括 !@#_ 等不属于编程运算符的符号
 *
 * @example
 *
 * 变量：#{variable} 可以获取 context 中对应的变量的值
 * 嵌套：@{fid} 可嵌套其他的 flowItem 作为变量
 */
export type Expression = string;

// export interface FlowExpression {
//   /** 表达式类型 */
//   type: 'flow-express';
//   /** 表达式的处理格式 */
//   handler: Expression;
// }

// interface ComputeExpression {
//   /** 表达式类型 */
//   type: 'compute';
//   /** 表达式的处理格式 */
//   handler: Expression;
// }

// interface FetchDataExpression {
//   /** 表达式类型 */
//   type: 'fetch-data';
//   /** 表达式的处理格式 */
//   handler: Expression;
// }

// type ExpressionTypes = ComputeExpression | FetchDataExpression;
// export default ExpressionTypes;

export default Expression;
