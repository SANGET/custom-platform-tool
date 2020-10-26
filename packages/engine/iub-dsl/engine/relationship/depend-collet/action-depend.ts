import { ActionsDefinition, AllActionType, } from "@iub-dsl/definition/actions/action";
import { APBDSLCURD, DataCollection, EnumCURD } from "@iub-dsl/definition";
import {
  ActionDependCollection, ActionDepend, DependInfo
} from "../types";
import { pickActionId } from "../../actions-manage/actions-parser";

/**
 * 收集表名, 数据元数据描述的, 收集的信息是详细的描述
 */

const dataCollectDependCollect = (conf: DataCollection): ActionDepend => {
  const { actionOptions: { struct, collectionType }, actionId } = conf;
  const metadataToUse: DependInfo[] = [];
  const schemasToUse: DependInfo[] = [];
  struct.forEach((v) => {
    if (typeof v === 'object') {
      if (v.field) {
        metadataToUse.push({ refValue: v.field });
      }
      if (v.collectField) {
        schemasToUse.push({ refValue: v.collectField });
      }
    } else {
      schemasToUse.push({ refValue: v });
    }
  });
  return {
    actionId,
    metadataToUse,
    schemasToUse
  };
};

/** TODO: 动作依赖还有子依赖?? way?, 应该由路径进行标示,而非子依赖 */
/**
 * 动作有多个来源的依赖
 * 一个动作可以触发多个影响
 */
const APBDSLActionDependCollect = (conf: APBDSLCURD): ActionDepend => {
  const { actionOptions: { actionList }, actionId } = conf;
  const metadataToUse: DependInfo[] = [];
  Object.values(actionList).forEach((info) => {
    const { table } = info;
    metadataToUse.push({
      refValue: table
    });
    // if (info.type === EnumCURD.TableInsert) {
    //   dataCollectDependCollect(info.fieldMapping);
    // }
  });

  return {
    actionId,
    metadataToUse,
    flowUsed: []
  };
};

const actionCollectScheduler = (actionType: AllActionType) => {
  switch (actionType) {
    case 'APBDSLCURD':
      return APBDSLActionDependCollect;
    default:
      return false;
  }
};

export const actionsCollectConstor = () => {
  const actionDependCollection: ActionDependCollection = [];
  const actionDependId: string[] = [];
  console.log(actionDependCollection);

  const actionDependCollect = (actionId: string, actionConf: ActionsDefinition, context) => {
    const collectFn = actionCollectScheduler(actionConf.actionType);
    if (collectFn) {
      actionDependCollection.push(collectFn(actionConf as APBDSLCURD));
      actionDependId.push(actionId);
    }
  };

  const flowToUseCollect = ({ flowId, actionId }: flowToUseCollectParam) => {
    actionId = pickActionId(actionId || '');
    const idx = actionDependId.indexOf(actionId);
    const actionDepend = actionDependCollection[idx];
    if (actionDepend) {
      (actionDepend.flowUsed || (actionDepend.flowUsed = [])).push(flowId);
    }
  };

  const findEquMetadata = (metadata: string, { runtimeScheduler }) => {
    const filterADC = actionDependCollection.filter(({ metadataToUse, flowUsed }) => {
      const matchMetadata = metadataToUse?.map(({ refValue }) => {
        const value = runtimeScheduler({
          type: 'getTable',
          params: [refValue]
        });
        if (value === metadata) {
          return metadata;
        }
        return false;
      }).filter((v) => v);
      return matchMetadata?.length;
    });
    return getActionDependFlowUsed(filterADC, {});
  };

  const getActionDependFlowUsed = (adc: ActionDependCollection, {}) => {
    return adc.map(({ flowUsed }) => flowUsed).filter((v) => v) as string[][];
  };

  return {
    actionDependCollect,
    flowToUseCollect,
    findEquMetadata,
    getActionDependFlowUsed
  };
};

interface flowToUseCollectParam {
  flowId: string;
  actionId: string;
}
