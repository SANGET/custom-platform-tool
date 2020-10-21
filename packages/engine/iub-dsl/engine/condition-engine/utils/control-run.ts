import { ConditionControl } from "@iub-dsl/definition";
import { arrayAsyncHandle } from "../../utils";

/** 条件控制运行的上下文 */
interface CondEngineRunCtx {
  condItemHandle: any
  condControlResHandle: any
}

/**
 * 情况
 * 1. 条件处理结果为boolean
 * 2. apb-dsl结果为JSON
 * 条件控制的运行 condControl
 * @param condControl ConditionControl 条件控制「公式」
 * @param condEngineRunCtx CondEngineRunCtx 条件控制运行的上下文
 * @returns T
 */
export const condControlRun = async <T = any>(condControl: ConditionControl, condEngineRunCtx: CondEngineRunCtx) => {
  const { and, or } = condControl;
  const result: {
    and?: T[],
    or?: T[]
  } = { };
  if (and?.length) {
    result.and = await condOrCondStructRun(and, condEngineRunCtx);
  }
  if (or?.length) {
    result.or = await condOrCondStructRun(or, condEngineRunCtx);
  }
  return result;
};

/**
 * 递归处理 and/or中每条信息的内容
 * @param condOrStructs 条件信息的ID或条件控制结构
 * @param condEngineRunCtx 条件控制运行的上下文
 * @param result 当前结构运行的结果
 */
const condOrCondStructRun = async (
  condOrStructs: (string | ConditionControl)[],
  condEngineRunCtx: CondEngineRunCtx
) => {
  const { condItemHandle, condControlResHandle } = condEngineRunCtx;
  // 断言 condItemHandle, condControlResHandle
  const condOrCondStructHandle = async (condOrStruct) => {
    if (typeof condOrStruct === 'string') {
      /** 单个条件处理 */
      return await condItemHandle(condOrStruct);
    } if (condOrStruct) {
      /** 条件struct的条件生成 */
      return condControlResHandle(
        await condControlRun(condOrStruct, condEngineRunCtx)
      );
    }
    return undefined;
  };

  const result = arrayAsyncHandle(condOrStructs, {
    handle: condOrCondStructHandle,
  });

  return result;
};
