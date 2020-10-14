import { ConditionSymbol, ConditionOperator } from "./condition-symbol";

/** 预留: 低代码的描述 */
interface ExpressionStruct {
  a: 'b'
}

type ConditionDescriptionInfo = string | ExpressionStruct;

/** exp为表达式的意思: 对应原型每个格子 */
interface ConditionItemInfo {
  operator: ConditionOperator;
  exp1: ConditionDescriptionInfo;
  exp2?: ConditionDescriptionInfo;
  exp3?: ConditionDescriptionInfo;
  exp4?: ConditionDescriptionInfo;
  exp5?: ConditionDescriptionInfo;
  // [exp: string]: ConditionDescriptionInfo;
}
/** 对应条件配置中: 每一条的条件配置 */
interface ConditionItemList {
  [condId: string]: ConditionItemInfo
}

/** 对应条件配置中: 条件公式 */
type ConditionControl = {
  [condSymbol in ConditionSymbol]?: (string | ConditionControl)[];
};

export interface Condition {
  conditionItemList: ConditionItemList;
  conditionControl: ConditionControl;
}

const conditionExample: Condition = {
  conditionItemList: {
    condId0: {
      operator: ConditionOperator.EMPTY,
      exp1: '3'
    },
    condId1: {
      operator: ConditionOperator.N_EMPTY,
      exp1: '@(schemas).entity_25'
    },
    condId2: {
      operator: ConditionOperator.EQU,
      exp1: '@(schemas).entity_26',
      exp2: '@(schemas).entity_27'
    }
  },
  conditionControl: {
    and: ['condId2', 'condId1'],
    or: ['condId0']
  }
};

const originNormalParamHandle = (param: FnParam) => param;

const expValid = (exps: any[], validLength = 1) => exps.slice(0, validLength).every((e) => e !== undefined);

interface FnParam {
  operator: ConditionOperator,
  expsValue: any
}

interface NormalParserFn {
  (param: FnParam): boolean;
}

interface ConditionHandleBeforeOptions {
  /** 需要验证Exp有效的长度 */
  expValidLength?: number;
  // needValidOperator: ConditionOperator;
}

interface ConditionItemListParserRes {
  conditionHandleFn: NormalParserFn;
  normalParam: FnParam;
}

const normalParamFn = (conf: ConditionItemInfo): FnParam => {
  const { operator, ...exp } = conf;
  const expsValue = Object.values(exp);
  return {
    operator,
    expsValue
  };
};
const conditionHandleBefore = (
  originHandle: NormalParserFn,
  {
    /** 再次验证操作符是否有必要 */
    // needValidOperator,
    expValidLength = 1,
  }: ConditionHandleBeforeOptions
) => {
  return ({ operator, expsValue }) => {
    if (
      // operator === needValidOperator &&
      expValid(expsValue, expValidLength)
    ) {
      return originHandle({ operator, expsValue });
    }
    return false;
  };
};

const nEmptyHandle = ({ operator, expsValue }: FnParam) => {
  return !emptyHandle({ operator, expsValue });
};

const emptyHandle = ({ operator, expsValue }: FnParam) => {
  return expsValue[0] === null || expsValue[0] === '';
};

const equHandle = ({ operator, expsValue }: FnParam) => {
  console.log(expsValue);
  return expsValue[0] === expsValue[1];
};

const actualConditionHandleFnList = {
  [ConditionOperator.EQU]: conditionHandleBefore(
    equHandle, {}
  ),
  [ConditionOperator.N_EMPTY]: conditionHandleBefore(
    nEmptyHandle, {}
  ),
  [ConditionOperator.EMPTY]: conditionHandleBefore(
    emptyHandle, {}
  ),
  [ConditionOperator.BETWEEN]: conditionHandleBefore(
    nEmptyHandle, {}
  ),
  [ConditionOperator.GERATER]: conditionHandleBefore(
    nEmptyHandle, {}
  ),
  [ConditionOperator.GERATER_EQU]: conditionHandleBefore(
    nEmptyHandle, {}
  ),
  [ConditionOperator.IN]: conditionHandleBefore(
    nEmptyHandle, {}
  ),
  [ConditionOperator.LESS]: conditionHandleBefore(
    nEmptyHandle, {}
  ),
  [ConditionOperator.LESS_EQU]: conditionHandleBefore(
    nEmptyHandle, {}
  ),
  [ConditionOperator.LIKE]: conditionHandleBefore(
    nEmptyHandle, {}
  ),
  [ConditionOperator.N_BETTWEEN]: conditionHandleBefore(
    nEmptyHandle, {}
  ),
  [ConditionOperator.N_EQU]: conditionHandleBefore(
    nEmptyHandle, {}
  ),
  [ConditionOperator.N_IN]: conditionHandleBefore(
    nEmptyHandle, {}
  ),
  [ConditionOperator.N_LIKE]: conditionHandleBefore(
    nEmptyHandle, {}
  ),
  [ConditionOperator.S_N_WITH]: conditionHandleBefore(
    nEmptyHandle, {}
  ),
  [ConditionOperator.S_WITH]: conditionHandleBefore(
    nEmptyHandle, {}
  ),
};

const getActualConditionHandleFn = (operator: ConditionOperator) => {
  return actualConditionHandleFnList[operator] || (() => false);
};

/** 每个条件描述的解析器 */
const conditionItemListParser = (itemInfo: ConditionItemInfo, parserContext): ConditionItemListParserRes => {
  const { operator } = itemInfo;
  /** 先解析后运行, 需要收集依赖, 并且可以动态设置对象值 */
  // let { expParser = originNormalParamParser } = parserContext;
  // if (expParser !== originNormalParamParser) {
  // expParser = expParser(originNormalParamParser, {
  // 暴露condition内部上下文
  // });
  // }
  // console.log(expParser(normalParam));

  const normalParam = normalParamFn(itemInfo);

  const actualConditionHandleFn: NormalParserFn = getActualConditionHandleFn(operator);
  return {
    conditionHandleFn: actualConditionHandleFn,
    normalParam
  };
};

// ? 不纯洁
const conditionListScheduler = (conditionItemList: ConditionItemList, parserContext) => {
  const conditionItemIds = Object.keys(conditionItemList);
  const conditionListParseRes: {
    [condId: string]: ConditionItemListParserRes
  } = {};
  conditionItemIds.forEach((id) => {
    conditionListParseRes[id] = conditionItemListParser(conditionItemList[id], parserContext);
  });

  return {
    conditionItemIds,
    conditionListParseRes
  };
};

const conditionControlRun = (conf: ConditionControl, context) => {
  const {
    getConditionFn
  } = context;
  const { and, or } = conf;
  const validFn = (idOrControl) => {
    if (typeof idOrControl === 'string') {
      return getConditionFn(idOrControl)();
    }
    return conditionControlRun(idOrControl, context);
  };
  let andRes = false;
  if (and && and.length) {
    andRes = and.every(validFn);
  }
  const orRes = or?.some(validFn) || false;
  return andRes || orRes;
};

export const conditionParser = (parserContext, conf: Condition = conditionExample) => {
  const { conditionControl, conditionItemList } = conf;

  let {
    conditionParamHandle = originNormalParamHandle
  } = parserContext;
  if (conditionParamHandle !== originNormalParamHandle) {
    conditionParamHandle = conditionParamHandle(originNormalParamHandle, {
      // 内部上下
    });
  }

  const conditionParseRes = conditionListScheduler(conditionItemList, parserContext);
  const { conditionItemIds, conditionListParseRes } = conditionParseRes;

  const getConditionFn = (conditionId) => {
    if (conditionItemIds.includes(conditionId)) {
      const { conditionHandleFn, normalParam } = conditionListParseRes[conditionId];
      // !!! TODO: 问题
      return () => conditionHandleFn(
        conditionParamHandle(normalParam)
      );
    }
    console.error('未获取到, 已经解析的condition');
    return () => false;
  };

  console.log(conditionParseRes);
  return conditionControlRun(conditionControl, {
    getConditionFn
  });
};
