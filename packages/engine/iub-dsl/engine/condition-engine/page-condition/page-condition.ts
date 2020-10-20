import { ConditionOperator } from '@iub-dsl/definition';
import { normalCondParam } from '../utils';

const expValid = (exps: any[], validLength = 1) => exps.slice(0, validLength).every((e) => e !== undefined);
interface NormalParserFn {
  (param: normalCondParam): boolean;
}

const nEmptyHandle = ({ operator, expsValue }: normalCondParam) => {
  return !emptyHandle({ operator, expsValue });
};

const emptyHandle = ({ operator, expsValue }: normalCondParam) => {
  return expsValue[0] === null || expsValue[0] === '';
};

const equHandle = ({ operator, expsValue }: normalCondParam) => {
  console.log(expsValue);
  return expsValue[0] === expsValue[1];
};

interface CondOperatorHandleOptions {
  /** 需要验证Exp有效的长度 */
  expValidLength?: number;
  // needValidOperator: ConditionOperator;
}

/**
 * 公共条件操作符函数的额外操作
 * @param originHandle 原始的操作符函数
 * @param param1 上下文选项
 */
const condOperatorHandle = (
  originHandle: NormalParserFn,
  {
    /** 再次验证操作符是否有必要 */
    // needValidOperator,
    expValidLength = 1,
  }: CondOperatorHandleOptions
) => {
  return ({ operator, expsValue }) => {
    if (
      // operator === needValidOperator &&
      expValid(expsValue, expValidLength)
    ) {
      return originHandle({ operator, expsValue });
    }
    console.error('验证条件表达式参数前置失败!!~~');
    return false;
  };
};

/** 页面操作符处理函数列表 */
const condOperatorHandleList = {
  [ConditionOperator.EQU]: condOperatorHandle(
    equHandle, { expValidLength: 2 }
  ),
  [ConditionOperator.N_EMPTY]: condOperatorHandle(
    nEmptyHandle, {}
  ),
  [ConditionOperator.EMPTY]: condOperatorHandle(
    emptyHandle, {}
  ),
  [ConditionOperator.BETWEEN]: condOperatorHandle(
    nEmptyHandle, {}
  ),
  [ConditionOperator.GERATER]: condOperatorHandle(
    nEmptyHandle, {}
  ),
  [ConditionOperator.GERATER_EQU]: condOperatorHandle(
    nEmptyHandle, {}
  ),
  [ConditionOperator.IN]: condOperatorHandle(
    nEmptyHandle, {}
  ),
  [ConditionOperator.LESS]: condOperatorHandle(
    nEmptyHandle, {}
  ),
  [ConditionOperator.LESS_EQU]: condOperatorHandle(
    nEmptyHandle, {}
  ),
  [ConditionOperator.LIKE]: condOperatorHandle(
    nEmptyHandle, {}
  ),
  [ConditionOperator.N_BETTWEEN]: condOperatorHandle(
    nEmptyHandle, {}
  ),
  [ConditionOperator.N_EQU]: condOperatorHandle(
    nEmptyHandle, {}
  ),
  [ConditionOperator.N_IN]: condOperatorHandle(
    nEmptyHandle, {}
  ),
  [ConditionOperator.N_LIKE]: condOperatorHandle(
    nEmptyHandle, {}
  ),
  [ConditionOperator.S_N_WITH]: condOperatorHandle(
    nEmptyHandle, {}
  ),
  [ConditionOperator.S_WITH]: condOperatorHandle(
    nEmptyHandle, {}
  ),
};

/**
 * 获取页面条件操作符的处理函数
 * @param operator 条件操作符
 */
export const getPageCondOperatorHandle = (operator: ConditionOperator): NormalParserFn => {
  let temp: NormalParserFn;
  if ((temp = condOperatorHandleList[operator])) {
    /** TODO: 缺少包装器扩展 */
    return temp;
  }
  console.error('未获取到页面条件操作符的处理函数?~? getPageCondOperatorHandle');
  return (param) => false;
};

/** 页面条件and/or的结果 */
interface PageCondControlRes {
  and?: boolean[];
  or?: boolean[];
}

/**
 * 页面条件控制的处理 「整合and/or的结果」
 * @param condControlRes 条件控制and/or的结果
 */
export const pageCondControlResHandle = (condControlRes: PageCondControlRes): boolean => {
  const { and, or } = condControlRes;
  /** 与条件的处理 */
  const andCondRes = and?.every((v) => v);
  /** 或条件得处理 */
  const orCondRes = or?.some((v) => v) || false;
  return andCondRes || orCondRes;
};
