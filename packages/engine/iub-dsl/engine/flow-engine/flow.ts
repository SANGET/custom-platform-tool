import { ActionFlow } from "@iub-dsl/definition/actions/action-collection";

/**
 * 流程执行器
 */
const flowExecutor = (actionFlow: ActionFlow, parserContext: ParserContextGroup) => {
  console.log(actionFlow);
  // TODO: 流程表达式解析
};

export default flowExecutor;
