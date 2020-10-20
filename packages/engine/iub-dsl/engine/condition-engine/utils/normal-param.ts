import {
  ConditionItemInfo, ConditionOperator,
  ConditionDescriptionInfo, ConditionList
} from "@iub-dsl/definition";

/** 规范化的条件信息 */
export interface normalCondParam {
  operator: ConditionOperator,
  expsValue: ConditionDescriptionInfo[]
}
/** 规范化的条件列表信息 */
export interface normalCondListParam {
  [condId: string]: normalCondParam
}

/**
 * 规范化条件信息
 * @param conf ConditionItemInfo 条件信息
 */
const normalParamOfCondItem = (conf: ConditionItemInfo): normalCondParam => {
  const { operator, ...exp } = conf;
  const expsValue = Object.values(exp);
  return {
    operator,
    expsValue
  };
};

/**
 * 规范化条件列表
 * @param condList ConditionList 使用的条件列表
 */
export const normalParamOfCondList = (condList: ConditionList) => {
  const condIds = Object.keys(condList);

  const result: normalCondListParam = {};

  for (let i = 0; i < condIds.length; i++) {
    const condId = condIds[i];
    result[condId] = normalParamOfCondItem(condList[condId]);
  }
  return result;
};
