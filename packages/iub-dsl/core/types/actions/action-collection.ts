import ExpressionTypes from "./expression";

interface FlowItem {
  /** 用于标识此流程产生出的值赋予的变量的名称 */
  variable: string;
  /** 此流程的执行表达式 */
  expression: ExpressionTypes;
  /** 是否注册到页面上下文 */
  isReturn?: boolean;
}

/** 动作描述 */
export type ActionFlow = {
  flowItems: {
    [flowItemID: string]: FlowItem;
  };
  flowCondition: {
    [flowItemID: string]: FlowItem;
  };
  flowControl: string;
};
