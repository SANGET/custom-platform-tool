import { ActionsDefinition, ActionCollection } from "@iub-dsl/definition/actions/action";

import { updateStateAction, dataCollectionAction, openModal } from "./sys-actions";
import { APBDSLCURDAction } from "./business-actions";

interface ExtralActionParseRes {
  // actionConf, // ! 尽量不要暴露, 因为actionConf会不安全
  changeStateToUse: string[];
  getStateToUse: string[];
}

interface OriginActionInfoParseRes {
  actionHandle: any; // Func
}
type ActionInfoParseRes = OriginActionInfoParseRes & ExtralActionParseRes

interface ActionInfoListParseRes {
  [actionId: string]: ActionInfoParseRes
}

interface ActionParserRes {
  actionIds: string[];
  actionParseRes: ActionInfoListParseRes;
  getActionParseRes: (actionID: string) => ActionInfoParseRes
}

const getExtralActionParserRes = (): ExtralActionParseRes => ({ changeStateToUse: [], getStateToUse: [] });
const actionRegExp = /^@\(actions\)\./;

export const pickActionId = (str: string) => str.replace(actionRegExp, '');
export const actionsCollectionParser = (
  actionCollection: ActionCollection,
  parsrContext
): ActionParserRes => {
  const actionParseRes = {};
  const actionIds = Object.keys(actionCollection);
  const { actionDependCollect } = parsrContext;
  actionIds.forEach((key) => {
    /** TODO: 待修改 */
    if (actionDependCollect) {
      actionDependCollect(key, actionCollection[key]);
    }

    actionParseRes[key] = {
      /** 原始逻辑必要的 */
      actionHandle: getActionFn(actionCollection[key]),
      /** 额外逻辑, 充分的 TODO: 终究对逻辑有侵入 */
      ...commonActionConfParser(
        actionCollection[key],
        getExtralActionParserRes(),
        parsrContext
      )
    };
  });

  /** 对外暴露获取的函数 */
  const getActionParseRes = (actionID: string): ActionInfoParseRes => {
    actionID = pickActionId(actionID);
    if (actionIds.includes(actionID)) {
      return actionParseRes[actionID];
    }
    return {
      actionHandle: () => { console.error('未获取Actions'); },
      changeStateToUse: [],
      getStateToUse: []
    };
  };

  return {
    actionParseRes,
    actionIds,
    getActionParseRes
  };
};

/** TODO: 待修改 */
const commonActionConfParser = (
  actionConf,
  actionConfParseRes: ExtralActionParseRes,
  parsrContext
): ExtralActionParseRes => {
  const { actionConfParser } = parsrContext;

  if (actionConfParser) {
    return actionConfParser(actionConf, actionConfParseRes, parsrContext);
  }

  return actionConfParseRes;
};

const getActionFn = (actionConf: ActionsDefinition) => {
  switch (actionConf.actionType) {
    case 'updateState':
      return updateStateAction(actionConf);
    case 'dataCollection':
      return dataCollectionAction(actionConf);
    case 'APBDSLCURD':
      return APBDSLCURDAction(actionConf);
    case 'openModal':
      return openModal(actionConf);
    default:
      if (typeof actionConf === 'function') {
        return actionConf;
      }
      console.error('err action');
      return () => {};
  }
};
