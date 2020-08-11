import { ActionFlow } from "@iub-dsl/core";
import { conditionP, whenP, funcP } from './code-engine';

interface ParseResultRef {
  actionID: string;
  type: string;
  handle: (runtimeContext, ...args: any) => void
  paramStruct: string;
  variableStruct: string;
  // when: string[]; // 和整个app的运行时相关
  when: (runtimeContext, ...args: any) => boolean; // ?? 按照配置也是低代码
  condition: (runtimeContext, ...args: any) => boolean; // ?? 按照配置也是低代码
}

export const funcWrap = (param: ParseResultRef) => {
  // 事件代理
  return (runtimeContext) => {
    return (...args) => {
      return param.handle(runtimeContext, ...args);
    };
  };
};
export const parseActionItem = (actionID, actionItem: ActionFlow) => {
  const result: ParseResultRef = {
    actionID,
    type: '',
    handle: () => ({}),
    paramStruct: '',
    variableStruct: '',
    when: () => false,
    condition: () => false,
  };

  result.handle = funcP(actionItem, actionID);

  // TODO:
  result.when = whenP(actionItem);
  result.condition = conditionP(actionItem);

  return funcWrap(result);
};

export const ActionsCollectionParser = (actionsCollection: {
  [actionID: string]: ActionFlow;
}) => {
  return Object.keys(actionsCollection).reduce((actionParseRes, actionID) => {
    actionParseRes[actionID] = parseActionItem(actionID, actionsCollection[actionID]);
    return actionParseRes;
  }, {});
};

interface ActionsItem {

  actionId: string;

  doAction: string;

}

class Action {
  actions: ActionsItem[] = []
}
