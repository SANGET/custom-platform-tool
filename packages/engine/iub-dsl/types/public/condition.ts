import { ConditionSymbol } from "../../apb-dsl";

/**
 * 先放着, 低代码的接口
 */
interface ExpressionStruct {
  a: 'b'
}

type ConditionDescriptionInfo = string | ExpressionStruct;
type ConditionListStruct = {
  [condId: string]: {
    operator: string;
    // operator: ConditionalOperator;
    exp1: ConditionDescriptionInfo;
    exp2?: ConditionDescriptionInfo;
    // exp3?: ConditionDescriptionInfo;
    // [exp: string]: ConditionDescriptionInfo;
  }
}
type ConditionControlStruct = {
  [condSymbol in ConditionSymbol]?: (string | ConditionControlStruct)[];
};

export interface Condition {
  conditionList: ConditionListStruct;
  conditionControl: ConditionControlStruct;

}
