import { ConditionSymbol, ConditionOperator } from "./condition-symbol";

/** 预留: 低代码的描述 */
interface ExpressionStruct {
  a: 'b'
}

export type ConditionDescriptionInfo = string | ExpressionStruct;

/** exp为表达式的意思: 对应原型每个格子 */
export interface ConditionItemInfo {
  operator: ConditionOperator;
  exp1: ConditionDescriptionInfo;
  exp2?: ConditionDescriptionInfo;
  exp3?: ConditionDescriptionInfo;
  exp4?: ConditionDescriptionInfo;
  exp5?: ConditionDescriptionInfo;
  // [exp: string]: ConditionDescriptionInfo;
}
/** 对应条件配置中: 每一条的条件配置 */
export interface ConditionList {
  [condId: string]: ConditionItemInfo
}

/** 对应条件配置中: 条件公式 */
export type ConditionControl = {
  [condSymbol in ConditionSymbol]?: (string | ConditionControl)[];
};

export interface Condition {
  conditionList: ConditionList;
  conditionControl: ConditionControl;
}
