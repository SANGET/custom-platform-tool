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

/** 条件验证的包装函数, 验证 expsValue是否有效 */
const originGenCondFnWrap = (originHandle, ctx?) => {
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
  [ConditionOperator.EQU]: genEquCond,
  [ConditionOperator.N_EMPTY]: genNotEmptyCond,
  [ConditionOperator.EMPTY]: genEmptyCond,
  [ConditionOperator.BETWEEN]: genNotEmptyCond,
  [ConditionOperator.GERATER]: genNotEmptyCond,
  [ConditionOperator.GERATER_EQU]: genNotEmptyCond,
  [ConditionOperator.IN]: genInCond,
  [ConditionOperator.LESS]: genNotEmptyCond,
  [ConditionOperator.LESS_EQU]: genNotEmptyCond,
  [ConditionOperator.LIKE]: genLikeCond,
  [ConditionOperator.N_BETTWEEN]: genNotEmptyCond,
  [ConditionOperator.N_EQU]: genNotEquCond,
  [ConditionOperator.N_IN]: genNotEmptyCond,
  [ConditionOperator.N_LIKE]: genNotEmptyCond,
  [ConditionOperator.S_N_WITH]: genNotEmptyCond,
  [ConditionOperator.S_WITH]: genNotEmptyCond,
};

/**
 * 获取APBDSL条件操作符处理函数
 * @param operator 条件操作符
 */
export const getAPBDSLCondOperatorHandle = ({ genCondFnWrap = originGenCondFnWrap }, operator: ConditionOperator) => {
  let temp;
  if ((temp = genCondFnList[operator])) {
    temp = genCondFnWrap(temp, { originHandle: originGenCondFnWrap });
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
    /** 删除为空的条件 */
    // if (!condControlRes.and.length) Reflect.deleteProperty(condControlRes, 'and');
  }
  if (condControlRes.or) {
    condControlRes.or = condControlRes.or.filter((v) => v);
    // if (!condControlRes.or.length) Reflect.deleteProperty(condControlRes, 'or');
  }

  return condControlRes;
};
