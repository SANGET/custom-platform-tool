import { ActionFlow } from "@iub-dsl/core/types/actions/action-collection";
import ExpressionExecutor from '../expression-executor';
import { ParserContextGroup } from "../../types/parser-interface";

/**
 * 流程执行器
 */
const flowExecutor = (actionFlow: ActionFlow, parserContext: ParserContextGroup) => {
  // console.log(actionFlow);
  const { flowItems, flowCondition, flowControl } = actionFlow;
  ExpressionExecutor({
    exec: flowControl
  }, parserContext);
  // TODO: 流程表达式解析
};

export default flowExecutor;
