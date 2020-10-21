import { UpdateState } from "@iub-dsl/definition/actions";
import { RuntimeSchedulerFnName } from "../../runtime";

/**
 * 最重要的问题: 流程和隔离
 * 单个action和多个action
 * 事件触发、标准输入「action输入是标准输入」
 * 1. 需要用到标准输入得, 不需要用到标准输入得
 * 2. 配置流程中的上下文的「流程引擎中识别」
 */
export const updateStateAction = (conf: UpdateState) => {
  // 更新状态动作的配置和定义
  const {
    actionOptions: {
      changeTarget,
      changeMapping
    },
    actionName, actionOutput, actionId
  } = conf;
  if (changeTarget) {
    return async ({ action, runtimeFnScheduler }) => {
      // action, 标准得事件执行上下文, param2 运行时上下文标准函数
      return await runtimeFnScheduler({
        actionName,
        action,
        actionId,
        type: RuntimeSchedulerFnName.targetUpdateState,
        params: [changeTarget, action.payload],
      });
    };
  }
  if (changeMapping) {
    return async ({ action, runtimeFnScheduler }) => {
      return await runtimeFnScheduler({
        actionName,
        action,
        type: RuntimeSchedulerFnName.targetUpdateState,
        params: [changeMapping, action.payload],
      });
    };
  }
  return () => {
  };
};
