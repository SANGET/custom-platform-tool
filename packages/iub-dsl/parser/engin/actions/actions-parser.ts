import { ActionFlow } from "@iub-dsl/core";
/**
 * 复杂的模板解析,暂时好像不需要依赖
 */

export const parseActionItem = (actionItem: ActionFlow) => {
  return (...args) => {
    // console.log(actionItem);
    // console.log(args[0]);
    console.log('运行的解析后的动作');
  };
};

export const ActionsCollectionParser = (actionsCollection: {
  [actionID: string]: ActionFlow;
}) => {
  return Object.keys(actionsCollection).reduce((actionParseRes, actionID) => {
    actionParseRes[actionID] = parseActionItem(actionsCollection[actionID]);
    return actionParseRes;
  }, {});
};
