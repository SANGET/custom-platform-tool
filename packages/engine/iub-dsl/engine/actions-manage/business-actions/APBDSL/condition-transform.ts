/** APB-DSL 条件转换 */

import {
  Condition, ConditionItemInfo, ConditionControl,
  ConditionOperator, ConditionSymbol,
  ConditionDescriptionInfo
} from "@iub-dsl/definition";

/** APBDSL条件的and/or的结果 */
export interface APBDSLCondition {
  and?: any[];
  or?: any[];
}

/** 相等 */
const genEquCond = ({ expsValue: [exp1, exp2] }) => ({ equ: { [exp1]: exp2 } });

/** 不相等 */
const genNotEquCond = ({ expsValue: [exp1, exp2] }) => ({ notEqu: { [exp1]: exp2 } });

/** 不为空 */
const genNotEmptyCond = ({ expsValue: [exp1] }) => ({ notEmpty: exp1 });

/** 为空 */
const genEmptyCond = ({ expsValue: [exp1] }) => ({ empty: exp1 });

/** 在[X,X]内 */
const genInCond = ({ expsValue: [exp1, exp2] }) => ({ in: { [exp1]: exp2 } });

/** 包含 */
const genLikeCond = ({ expsValue: [exp1, exp2] }) => ({ like: { [exp1]: exp2 } });

const genCondWrapFn = (originHandle, ctx) => {
  return (param) => {
    const { expsValue } = param;
    /** 获取了无效的expsValue */
    if (!expsValue) {
      return false;
    }
    return originHandle(param);
  };
};

const genCondFnList = {
  [ConditionOperator.EQU]: genCondWrapFn(
    genEquCond, {}
  ),
  [ConditionOperator.N_EMPTY]: genCondWrapFn(
    genNotEmptyCond, {}
  ),
  [ConditionOperator.EMPTY]: genCondWrapFn(
    genEmptyCond, {}
  ),
  [ConditionOperator.BETWEEN]: genCondWrapFn(
    genNotEmptyCond, {}
  ),
  [ConditionOperator.GERATER]: genCondWrapFn(
    genNotEmptyCond, {}
  ),
  [ConditionOperator.GERATER_EQU]: genCondWrapFn(
    genNotEmptyCond, {}
  ),
  [ConditionOperator.IN]: genCondWrapFn(
    genInCond, {}
  ),
  [ConditionOperator.LESS]: genCondWrapFn(
    genNotEmptyCond, {}
  ),
  [ConditionOperator.LESS_EQU]: genCondWrapFn(
    genNotEmptyCond, {}
  ),
  [ConditionOperator.LIKE]: genCondWrapFn(
    genLikeCond, {}
  ),
  [ConditionOperator.N_BETTWEEN]: genCondWrapFn(
    genNotEmptyCond, {}
  ),
  [ConditionOperator.N_EQU]: genCondWrapFn(
    genNotEquCond, {}
  ),
  [ConditionOperator.N_IN]: genCondWrapFn(
    genNotEmptyCond, {}
  ),
  [ConditionOperator.N_LIKE]: genCondWrapFn(
    genNotEmptyCond, {}
  ),
  [ConditionOperator.S_N_WITH]: genCondWrapFn(
    genNotEmptyCond, {}
  ),
  [ConditionOperator.S_WITH]: genCondWrapFn(
    genNotEmptyCond, {}
  ),
};

/**
 * 获取APBDSL条件操作符处理函数
 * @param operator 条件操作符
 */
export const getAPBDSLCondOperatorHandle = (operator: ConditionOperator) => {
  let temp;
  if ((temp = genCondFnList[operator])) {
    return temp;
  }
  console.error('未找到APBDSL条件操作符对应的处理函数?~? getAPBDSLCondOperatorHandle');
  return (param) => false;
};

/**
 * 页面条件控制的处理 「整合and/or的结果」
 * @param condControlRes 条件控制and/or的结果
 */
export const APBDSLCondControlResHandle = (condControlRes: APBDSLCondition): APBDSLCondition => {
  /** 过滤无效的条件处理 */
  if (condControlRes.and) {
    condControlRes.and = condControlRes.and.filter((v) => v);
  }
  if (condControlRes.or) {
    condControlRes.or = condControlRes.or.filter((v) => v);
  }

  return condControlRes;
};
