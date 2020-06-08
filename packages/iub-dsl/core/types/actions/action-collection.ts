import ExpressionTypes, { FlowExpression } from "./expression";

interface FlowItem {
  id: string;
  /** 用于标识此流程产生出的值赋予的变量的名称 */
  variable: string;
  /** 此流程的执行表达式 */
  expression: ExpressionTypes;
  flowExpression: FlowExpression;
}

/** 动作描述 */
export type ActionFlow = {
  flow: {
    [flowID: string]: FlowItem;
  };
};
