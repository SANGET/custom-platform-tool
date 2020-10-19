import { ActionsDefinition, ActionCollection } from "@iub-dsl/definition/actions/action";
import { from, pipe, Observable } from "rxjs";
import {
  map, tap, mergeAll, switchAll, concatAll, mergeMap
} from 'rxjs/operators';

import { updateStateAction, dataCollectionAction } from "./sys-actions";
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
  actionIds: string[]
  actionParseRes: ActionInfoListParseRes
}

const getExtralActionParserRes = (): ExtralActionParseRes => ({ changeStateToUse: [], getStateToUse: [] });

const wiresaee = [
  ['flow1', 'flow2', 'flow3'],
  ['flow32', 'flow12'],
  ['flow3132', 'flow12'],
  ['flow3132', 'fdjkljlj', 'fjoq[m'],
  ['flow32', 'fdjkljlj', 'fjoq[m'],
  ['flow32209jk', 'flow1223199'],
  ['flow322', 'flow1223199'],
];

const getFlowItem = (id) => () => {
  console.log(id);
};

/** promise第一层n个条件控制, 按顺序执行 */
const flowP = (wiresConf?) => {
  // const { outputsWires, wires, conditionConf } = wiresConf;
  // const wiresLine = wires.length;
  // return from(wiresaee).pipe(
  //   map((nextFlowIds) => from(nextFlowIds)),
  //   map((nexFlowId$) => {
  //     return nexFlowId$.pipe(
  //       map((nexFlowId) => getFlowItem(nexFlowId)),
  //       // 动作的执行
  //     );
  //   }),
  // );
};

const flowItemParserScheduler = (flowConf: ActionsDefinition) => {
  const {
    actionOptions, actionId, actionType,
    when, condition, actionName,
    actionOutput,
  } = flowConf;
  // wiresConf && flowP(wiresConf);

  const flowItemParseRes: any = {
    actionParseRes: {
      actionHandle: () => {},
      actionOutput: {},
      changeStateToUse: [],
      getStateToUse: []
    },
    conditionParseRes: {},
    nextflow: {}
  };
  switch (flowConf.actionType) {
    case 'APBDSLCURD':
      // APBDSLCURDAction(actionConf);
      break;
    case 'dataCollection':
      // dataCollectionAction(actionConf);
      break;
    case 'updateState':
      flowItemParseRes.actionParseRes.actionHandle = updateStateAction(flowConf);
      break;
    default:
      break;
  }
  return flowItemParseRes;
};

const scheduler = (...args) => {
  return 'true';
};

const actionItemRunWrap = (...args) => {
  return true;
};

const flowActionWrap = () => {
  const flowItemParseRes = {
    actionParseRes: {
      actionHandle: () => {},
      actionOutput: {},
      changeStateToUse: [],
      getStateToUse: []
    },
    conditionParseRes: {},
    nextflow: {},
    flowDeps: [], // 整个流程用到的所有变量
  };
  const flowCtx = {};
  if (scheduler(flowItemParseRes.conditionParseRes)) {
    const actionRes = actionItemRunWrap(flowItemParseRes.actionParseRes);
  }
};

const flowConfParser = (flowConfs: ActionsDefinition[]) => {
  return flowConfs.map((conf) => {
    return flowItemParserScheduler(conf);
  });
};

export const actionsCollectionParser = (
  actionCollection: ActionCollection,
  parserContext
) => {
  // const flowIds: string[] = Object.keys(actionCollection);
  // let flowConf: ActionsDefinition[];
  // const flowParseRes = {};
  // console.log(actionCollection);
  // for (let i = 0; i < flowIds.length; i++) {
  //   flowConf = actionCollection[flowIds[i]];
  //   flowParseRes[flowIds[i]] = flowConfParser(flowConf);
  // }
  // console.log(flowParseRes);

  const actionParseRes = {};
  const actionIds = Object.keys(actionCollection);
  actionIds.forEach((key) => {
    actionParseRes[key] = {
      /** 原始逻辑必要的 */
      actionHandle: getActionFn(actionCollection[key]),
      /** 额外逻辑, 充分的 TODO: 终究对逻辑有侵入 */
      ...commonActionConfParser(
        actionCollection[key],
        getExtralActionParserRes(),
        parserContext
      )
    };
  });

  return {
    actionParseRes,
    actionIds
  };
};

const commonActionConfParser = (
  actionConf,
  actionConfParseRes: ExtralActionParseRes,
  parserContext
): ExtralActionParseRes => {
  const { actionConfParser } = parserContext;
  if (actionConfParser) {
    return actionConfParser(actionConf, actionConfParseRes, parserContext);
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
    default:
      if (typeof actionConf === 'function') {
        return actionConf;
      }
      console.error('err action');
      return () => {};
  }
};
