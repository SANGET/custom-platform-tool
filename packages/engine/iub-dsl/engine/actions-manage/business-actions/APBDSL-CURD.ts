import {
  ApbFunction, APBDSLCURD, EnumCURD, NormalCURD,
  TableInsert, TableUpdate, TableSelect, TableDelete
} from "@iub-dsl/definition/actions";
import { dataCollectionAction } from "../sys-actions";
import { getGenAPBDSLFunctionTransform, SelectParamOfAPBDSL } from "./APBDSL";

const normalCURDActionParseScheduler = (action: NormalCURD) => {
  const { type: CURDType, table } = action;
  switch (action.type) {
    case EnumCURD.TableInsert:
      return genTableInsertFn(action);
    case EnumCURD.TableUpdate:
      return genTableUpdatetFn(action);
    case EnumCURD.TableSelect:
      return genTableSelectFn(action);
    case EnumCURD.TableDelete:
      return genTableDeleteFn(action);
    default:
      console.error('为获取到对应动作的处理');
      return () => {};
  }
};

const genTableInsertFn = (actionConf: TableInsert) => {
  const { fieldMapping, table } = actionConf;
  const getFiled = dataCollectionAction(fieldMapping);
  return async ({ action, runtimeFnScheduler }) => {
    /** 获取插入参数 */
    const set = await getFiled({ action, runtimeFnScheduler });
    /** 获取set转换函数 */
    const getSetOfAPBDSL = getGenAPBDSLFunctionTransform(ApbFunction.SET);
    /** 转换 */
    const APBDSLItem = getSetOfAPBDSL({ set, table });
    return APBDSLItem;
  };
};

const genTableUpdatetFn = (actionConf: TableUpdate) => {
  const { fieldMapping, table } = actionConf;
  const getFiled = dataCollectionAction(fieldMapping);
  return async ({ action, runtimeFnScheduler }) => {
    /** 获取插入参数 */
    const set = await getFiled({ action, runtimeFnScheduler });
    /** 获取upd转换函数 */
    const getUpdOfAPBDSL = getGenAPBDSLFunctionTransform(ApbFunction.UPD);
    /** 转换 */
    const APBDSLItem = getUpdOfAPBDSL({ set, table, condition: {} });
    return APBDSLItem;
  };
};

const genTableSelectFn = (actionConf: TableSelect) => {
  console.log(actionConf);

  const { table, condition } = actionConf;
  return async ({ action, runtimeFnScheduler }) => {
    /** 获取set转换函数 */
    const getSelectOfAPBDSL = getGenAPBDSLFunctionTransform(ApbFunction.SELECT);
    const selectParam: SelectParamOfAPBDSL = {
      table
    };
    if (condition) {
      selectParam.condition = await runtimeFnScheduler({
        type: 'ConditionHandleOfAPBDSL',
        params: [condition],
      });
    }
    /** 转换 */
    const APBDSLItem = getSelectOfAPBDSL(selectParam);
    return APBDSLItem;
  };
};

const genTableDeleteFn = (actionConf: TableDelete) => {
  const { table } = actionConf;
  return async ({ action, runtimeFnScheduler }) => {
    /** 获取set转换函数 */
    const getDelOfAPBDSL = getGenAPBDSLFunctionTransform(ApbFunction.DEL);
    /** 转换 */
    const APBDSLItem = getDelOfAPBDSL({ table, condition: {} });
    return APBDSLItem;
  };
};

/** 递归调用生成steps */
const APBDSLStepsFnRun = async ({ fns, result = [] }: any, runtimeCtx) => {
  const fn: any = fns?.shift();
  if (fn) {
    result.push(await fn(runtimeCtx));
  }
  if (fns?.length) {
    await APBDSLStepsFnRun({ fns, result }, runtimeCtx);
  }
  return result;
};

/**
 * APBDSL的CURD动作
 * @param conf APBDSL动作
 */
export const APBDSLCURDAction = (conf: APBDSLCURD) => {
  const {
    actionName, actionId, actionOutput,
    actionOptions: { actionList, actionStep, businesscode }
  } = conf;
  const APBActionIds = Object.keys(actionList);

  const steps: any[] = [];
  const APBDSL = {
    businesscode,
    steps
  };
  APBActionIds.forEach((id) => {
    const fn = normalCURDActionParseScheduler(actionList[id]);
    steps.push(fn);
  });
  return async (runtimeCtx) => {
    const action = {
      type: 'APBDSLCURDAction',
      businesscode
    };
    /** 生成很多函数? */
    APBDSL.steps = await APBDSLStepsFnRun({ fns: steps }, runtimeCtx);
    return await runtimeCtx?.runtimeFnScheduler({
      type: 'APBDSLrequest',
      params: [APBDSL],
      action,
      actionName,
    });
  };
};
