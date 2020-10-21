/** APBDSL 功能码转换 */

import { ApbFunction } from "@iub-dsl/definition";
import { APBDSLCondition } from ".";

type ColunmItem = { [columns: string]: string }
export interface SetParamOfAPBDSL {
  table: string;
  set: ColunmItem | ColunmItem[]
}
interface SetOfAPBDSL {
  code: ApbFunction.SET;
  params: {
    table: string;
    set: ColunmItem[]
  }
}

interface UpdateOfAPBDSL {
  code: ApbFunction.UPD;
  params: {
    table: string;
    set: { [columns: string]: string }[];
    condition: APBDSLCondition;
  }
}
export interface SelectParamOfAPBDSL {
  table: string;
  condition?: APBDSLCondition
}
interface SelectOfAPBDSL {
  code: ApbFunction.SELECT;
  params: {
    table: string;
    condition?: APBDSLCondition;
  }
}

interface DelOfAPBDSL {
  code: ApbFunction.DEL;
  params: {
    table: string;
    condition: APBDSLCondition;
  }
}
export const genSetOfAPBDSL = ({
  table, set
}: SetParamOfAPBDSL): SetOfAPBDSL => ({
  code: ApbFunction.SET,
  params: {
    table,
    set: Array.isArray(set) ? set : [set]
  }
});

export const genUpdateOfAPBDSL = ({
  table, set, condition
}): UpdateOfAPBDSL => ({
  code: ApbFunction.UPD,
  params: {
    table,
    set,
    condition
  }
});

export const genSelectOfAPBDSL = ({ table, condition }): SelectOfAPBDSL => ({
  code: ApbFunction.SELECT,
  params: {
    table, condition
  }
});

export const genDelOfAPBDSL = ({ table, condition }): DelOfAPBDSL => ({
  code: ApbFunction.DEL,
  params: {
    table,
    condition
  }
});

type APBDSLFunction = SetOfAPBDSL | UpdateOfAPBDSL | SelectOfAPBDSL | DelOfAPBDSL
interface FunctionOfAPBDSL<T extends APBDSLFunction> {
  function: T
}

// export const APBDSLFunctionItemWrap = (fnConf) => ({ function: fnConf });

/** function转换的包装器 */
const genFunctionItemWrapOfAPBDSL = <P, R extends APBDSLFunction>(originFn) => {
  return (param: P): FunctionOfAPBDSL<R> => ({ function: originFn(param) });
};

const APBDSLFunctionList = {
  [ApbFunction.SET]: genFunctionItemWrapOfAPBDSL<SetParamOfAPBDSL, SetOfAPBDSL>(genSetOfAPBDSL),
  [ApbFunction.DEL]: genFunctionItemWrapOfAPBDSL<any, DelOfAPBDSL>(genDelOfAPBDSL),
  [ApbFunction.SELECT]: genFunctionItemWrapOfAPBDSL<any, SelectOfAPBDSL>(genSelectOfAPBDSL),
  [ApbFunction.UPD]: genFunctionItemWrapOfAPBDSL<any, UpdateOfAPBDSL>(genUpdateOfAPBDSL),
};

interface GetGenAPBDSLFunctionTransform<P = any, R extends APBDSLFunction = APBDSLFunction> {
  (param: P): FunctionOfAPBDSL<R>
}
export const getGenAPBDSLFunctionTransform = (func: ApbFunction): GetGenAPBDSLFunctionTransform => {
  return APBDSLFunctionList[func];
};
