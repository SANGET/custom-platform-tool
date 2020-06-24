import { ActionFlow } from "@iub-dsl/core/types/actions/action-collection";

/**
 * 流程执行器
 */
const flowExecutor = (actionFlow: ActionFlow) => {
  // console.log(actionFlow);
  const { flowItems, flowCondition, flowControl } = actionFlow;

  // TODO: 流程表达式解析
};

export default flowExecutor;
