import { ApbFunction, APBDSLCURD, EnumCURD } from "@iub-dsl/definition/actions";
import { dataCollectionAction } from "../sys-actions";

const genSetOfAPBDSL = ({
  table, set
}) => ({
  code: ApbFunction.SET,
  params: {
    table,
    set
  }
});

const genUpdateOfAPBDSL = ({
  table, set, condition
}) => ({
  code: ApbFunction.UPD,
  params: {
    table,
    set,
    condition
  }
});

const APBDSLFunctionItemWrap = (fnConf) => ({ function: fnConf });

export const APBDSLCURDAction = (conf: APBDSLCURD) => {
  const {
    actionName, actionStep,
    actionList, businesscode
  } = conf;
  const APBActionIds = Object.keys(actionList);

  const steps: any[] = [];
  const APBDSL = {
    businesscode,
    steps
  };
  APBActionIds.forEach((id) => {
    const { fieldMapping, type: CURDType, table } = actionList[id];
    let fn: any = () => {};
    if (CURDType === EnumCURD.TableInsert) {
      const getFiled = dataCollectionAction(fieldMapping);
      fn = (action, runtimeFnScheduler) => {
        const set = getFiled(null, runtimeFnScheduler);
        const APBDSLItem = APBDSLFunctionItemWrap(
          genSetOfAPBDSL({
            set: [set],
            table
          })
        );
        return APBDSLItem;
      };
    }
    if (CURDType === EnumCURD.TableUpdate) {
      const getFiled = dataCollectionAction(fieldMapping);
      fn = (action, runtimeFnScheduler) => {
        const set = getFiled(null, runtimeFnScheduler);
        const APBDSLItem = APBDSLFunctionItemWrap(
          genUpdateOfAPBDSL({
            set,
            table,
            condition: {}
          })
        );
        return APBDSLItem;
      };
    }
    steps.push(fn);
  });
  return (action, runtimeFnScheduler) => {
    /** 生成很多函数? */
    APBDSL.steps = steps.map((fn) => fn(action, runtimeFnScheduler));
    return runtimeFnScheduler({
      type: 'APBDSLrequest',
      params: [APBDSL],
      action,
      actionName,
    });
  };
};
