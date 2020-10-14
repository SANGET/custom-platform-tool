/**
 * 1. 事件包装器
 * 2. 动作「updateState、stateCollection、CURD」
 * 3. 动作流程、动作副作用
 * 4. 条件流程、条件描述的处理
 *
 * 5. 表格查询、展示
 * TODO
 * 6. 数据更新的引用关系?
 */

/**
  * 把每一步的目的想清楚
  * 1. 渲染widget、 不同的配置,影响渲染的结构
  * 2. 事件绑定
  * 3. 动作执行
  */

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
      actionHandle: getActionFn(actionCollection[key]),
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
    actionShouldChangeState: [],
    actionShouldGetState: []
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
