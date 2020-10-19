import { FlowCollection, FlowItemInfo, FlowOutItemWires } from '@iub-dsl/definition/flow';

import { Condition, CommonCondition } from "@iub-dsl/definition";

const isPromise = (fn) => typeof fn?.then === 'function' || fn instanceof Promise;

interface OnceFlowOutRun {
  flowIds: string[];
  getFlowItemInfo: any;
  /** 出口所有线的运行是否阻塞 */
  isBlock?: boolean;
}

export const flowParser = (flows: FlowCollection, { parseContext, parseRes }) => {
  const flowIds = Object.keys(flows);

  console.log(flows);
  let flowId: string;
  const tempRes: any[] = [];
  const flowParseRes = {};
  for (let i = 0; i < flowIds.length; i++) {
    flowId = flowIds[i];
    const flowItemParseRes = flowItemParser(flows[flowId], { parseRes, parseContext });
    tempRes.push(flowItemParseRes);
    flowParseRes[flowId] = flowItemParseRes;
  }
  const getFlowItemInfo = getFlowItemInfoFnWrap(flowParseRes);
  tempRes.forEach((temp) => {
    temp.flowItemRun = temp.flowItemRun({ getFlowItemInfo });
  });
  tempRes.length = 0;
  return {
    flowParseRes,
    getFlowItemInfo
  };
};

const getFlowItemInfoFnWrap = (resolvedOfFlow) => {
  return (flowId) => resolvedOfFlow[flowId];
};

/**
 *「出口以及出口的线的运行不阻塞, 但是往下走是阻塞的」
 * 注意: 区分是否需要阻塞
 * 流程一个出口所有线的运行
 * @param flowIds 流程Ids
 * @param param1 上下文
 */
const onceFlowOutRunWrap = (flowIds: string[]) => {
  return async ({ getFlowItemInfo }, context = {}) => {
    /** 同一个出口出去的所有线上下文应该是同一个 */
    const newFlowCtx = Object.create(context);
    /** 一个出口所有线运行的结果 */
    const onceFlowOutRunRes = await onceFlowOutRun(newFlowCtx, { flowIds, getFlowItemInfo });
    /** TODO: 处理结果 */
    /** 返回原本的对象 */
    return Object.getPrototypeOf(newFlowCtx);
  };
};

/**
 * 一个流程出口所有线的运行. 全都promise化
 * @param flowCtx 流程上下文
 * @param param1 上下文
 */
const onceFlowOutRun = async (flowCtx, { flowIds, getFlowItemInfo }: OnceFlowOutRun) => {
  /** 不阻塞 */
  const onceFlowOutRunRes = flowIds.map((flowId, index) => {
    const flowItemRunInfo = getFlowItemInfo(flowId);
    const { flowItemRun } = flowItemRunInfo;
    const flowItemRunRes = flowItemRun(flowCtx);

    if (!isPromise(flowItemRunRes)) {
      return Promise.resolve(flowItemRunRes);
    }
    return flowItemRunRes;
  });

  return await Promise.all(onceFlowOutRunRes);
};

/** 预留: 阻塞的运行 */
const onceFlowOutBlockRun = async (flowIds: string[], runtimeCtx = {}, { getFlowItemInfo }) => {
  const flowId = flowIds.pop();
  if (flowId) {
    const { flowFn } = getFlowItemInfo(flowId);
    const res = flowFn(runtimeCtx, { getFlowItemInfo });
    if (isPromise(res)) {
      return await res;
    }
    return res;
  }
  return false;
};

/**
 * 流程中每一项动作的运行
 */
const flowItemRunWrap = ({
  actionHandle, flowOutRun: actualFlowOutRun,
  /** 控制当前项流程是否可以运行 */
  when, condition
}) => {
  return (flowRunOptions) => { // flowRunOptions
    return async (context = {}) => {
      let actionRunRes = actionHandle(context);
      /** TODO: context和动作结果的处理 */
      if (isPromise(actionRunRes)) {
        actionRunRes = await actionRunRes;
        await actualFlowOutRun?.(flowRunOptions, context);
      } else {
        /** 当前项流程运行完, 运行出口 */
        await actualFlowOutRun?.(flowRunOptions, context);
      }
      return context;
    };
  };
};

/**
 * 条件成了才能运行某个出口 {多个出口的运行也应该是非阻塞的}
 */
const flowOutRunWrap = ({ flowOut, flowOutCondition }) => {
  const flowOutNum = flowOut?.length || 0;
  const flowOutFns: any[] = [];

  // TODO:
  for (let i = 0; i < flowOutNum; i++) {
    const flowIds = flowOut[i];
    flowOutFns.push(onceFlowOutRunWrap(flowIds));
  }
  return async (flowRunOptions, context = {}) => {
    return await Promise.all(flowOutFns.map((fn) => fn(flowRunOptions, context)));
  };
};

/**
 * 1. 动作运行容器
 * 2. 流程通道运行 (二维数组)
 * 3. 每项流程运行控制
 */
const flowItemParser = (flowItem: FlowItemInfo, { parseContext, parseRes }) => {
  const {
    id, flowOut, flowOutCondition, actionId, when, condition
  } = flowItem;
  const { getActionFn } = parseRes;
  const actionInfo = getActionFn(actionId);
  const { actionHandle, changeStateToUse, getStateToUse } = actionInfo;

  const flowOutRun = flowOutRunWrap({ flowOutCondition, flowOut });
  const flowItemRun = flowItemRunWrap({
    actionHandle, flowOutRun, when, condition
  });
  return {
    flowItemRun,
    changeStateToUse,
    getStateToUse
  };
};
