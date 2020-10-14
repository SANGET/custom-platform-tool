import { ActionsDef } from "@iub-dsl/definition/actions";
import { updateStateAction, dataCollectionAction } from "./sys-actions";
import { APBDSLCURDAction } from "./business-actions";

export const actionsCollectionParser = (
  actionCollection: { [actionId: string]: ActionsDef },
  parserContext
) => {
  const actionIds = Object.keys(actionCollection);

  const actionParseRes = {};
  actionIds.forEach((key) => {
    actionParseRes[key] = {
      /** 原始逻辑必要的 */
      actionHandle: getActionFn(actionCollection[key]),
      /** 额外逻辑, 充分的 */
      ...commonActionConfParser(actionCollection[key], parserContext)
    };
  });

  return {
    actionIds,
    actionParseRes
  };
};

const commonActionConfParser = (actionConf, parserContext) => {
  const actionConfParseRes = {
    // actionConf, // ! 尽量不要暴露, 因为actionConf会不安全
    changeStateToUse: [],
    getStateToUse: []
  };
  const { actionConfParser } = parserContext;
  if (actionConfParser) {
    return actionConfParser(actionConf, actionConfParseRes, parserContext);
  }
  return actionConfParseRes;
};

const getActionFn = (actionConf: ActionsDef) => {
  switch (actionConf.type) {
    case 'updateState':
      return updateStateAction(actionConf);
    case 'dataCollection':
      return dataCollectionAction(actionConf);
    case 'APBDSLCURD':
      return APBDSLCURDAction(actionConf);
    default:
      console.error('err action');
      return () => {};
  }
};
