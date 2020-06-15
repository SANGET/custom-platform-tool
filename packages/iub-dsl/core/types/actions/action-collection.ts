import ExpressionRef from "./expression";


/** 动作描述 */
export type ActionFlow = {
  flow: {
    [flowID: string]: ExpressionRef;
  };
  flowExpression?: {
    [flowExpressionID: string]: ExpressionRef;
  };
  flowControl?: string;
};
