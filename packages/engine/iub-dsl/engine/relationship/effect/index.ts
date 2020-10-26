import { ApbFunction } from "@iub-dsl/definition";
import { APBDSLActionEffect, EffectType } from "../types";

/**
  * apbdsl的副作用分析
  */
const effectAnalysisOfAPBDSLCURD = (APBDSLCURDParam): APBDSLActionEffect[] => {
  const { businesscode, steps, actionId } = APBDSLCURDParam;
  const effectInfo: APBDSLActionEffect[] = [];
  steps.forEach(({ function: { code, params } }) => {
    const { table } = params;
    switch (code) {
      case ApbFunction.DEL:
      case ApbFunction.UPD:
      case ApbFunction.SET:
        effectInfo.push({
          actionId,
          effectType: EffectType.tableSelect,
          effectInfo: {
            table,
          },
          triggerInfo: {
            businesscode
          }
        });
        break;
      default:
        break;
    }
  });
  return effectInfo;
};

export const effectRelationship = () => {
  const effectCollection: any[] = [];

  const effectAnalysis = (schedulerCtx) => {
    const {
      action = {}, type, params, actionName
    } = schedulerCtx;

    const { type: actionType, actionId } = action;
    // console.log(actionType, actionId);

    let shouldUseEffect = () => {};

    switch (actionType) {
      case 'APBDSLCURDAction':
        shouldUseEffect = () => {
          console.log(actionType);
          effectCollection.push(...effectAnalysisOfAPBDSLCURD({ actionId, ...params[0] }));
        };
        break;
      default:
        break;
    }

    return shouldUseEffect;
  };
  const effectDispatch = (allPageCtx) => {
    allPageCtx.forEach((ctx) => {
      const { pageMark, runtimeScheduler, asyncRuntimeScheduler } = ctx;
      console.log(pageMark);
      asyncRuntimeScheduler({
        type: 'effectReceiver',
        params: [effectCollection, ctx],
        action: {
          type: 'effectCollection'
        }
      }).then((res) => {
        // console.log(res);
      });
    });
  };

  const effectReceiver = (effectCollect: any[], ctx) => {
    const { pageMark, runtimeScheduler, asyncRuntimeScheduler } = ctx;
    effectCollect.forEach(({ effectType, effectInfo }) => {
      if (effectType === 'tableSelect') {
        const { table } = effectInfo;
        if (table) {
          const flowUseds = runtimeScheduler({
            type: 'findEquMetadata',
            params: [table, ctx],
            action: {
              type: 'effectReceiver'
            }
          });
          const flowUsedsFlat = flowUseds?.flat().flat() || [];
          asyncRuntimeScheduler({
            type: 'flowsRun',
            params: [flowUsedsFlat, ctx],
            action: {
              type: 'effectReceiver'
            }
          });
        }
      }
    });
    console.log(effectCollect);
  };

  return {
    effectAnalysis,
    effectDispatch,
    effectReceiver
  };
};
