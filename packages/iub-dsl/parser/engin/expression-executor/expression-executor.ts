import { RequestAPIOfIUBDSL, ParserContextGroup } from "../../types";

export interface ExpressionExecutorParams {
  // requestAPI: RequestAPIOfIUBDSL
  exec: string;
}

const expressionExecutor = (
  params: ExpressionExecutorParams,
  parserContext: ParserContextGroup
) => {
  // TODO:
  // parserContext.context.requestAPI({});
  console.log('expression');
};

export default expressionExecutor;
