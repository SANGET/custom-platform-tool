import {
  ApbFunction, APBDSLCURD, EnumCURD, NormalCURD, TableInsert, TableUpdate, TableSelect
} from "@iub-dsl/definition/actions";
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

const genSelectOfAPBDSL = ({ table }) => ({
  code: ApbFunction.SELECT,
  params: {
    table,
  }
});

const APBDSLFunctionItemWrap = (fnConf) => ({ function: fnConf });

const normalCURDActionParseScheduler = (action: NormalCURD) => {
  const { type: CURDType, table } = action;
  switch (action.type) {
    case EnumCURD.TableInsert:
      return genTableInsertFn(action);
    case EnumCURD.TableUpdate:
      return genTableUpdatetFn(action);
    case EnumCURD.TableSelect:
      return genTableSelectFn(action);
    default:
      return () => {};
  }
};

const genTableInsertFn = (actionConf: TableInsert) => {
  const { fieldMapping, table } = actionConf;
  const getFiled = dataCollectionAction(fieldMapping);
  return (action, runtimeFnScheduler) => {
    const set = getFiled(null, runtimeFnScheduler);
    const APBDSLItem = APBDSLFunctionItemWrap(
      genSetOfAPBDSL({
        set: [set],
        table
      })
    );
    return APBDSLItem;
  };
};

const genTableUpdatetFn = (actionConf: TableUpdate) => {
  const { fieldMapping, table } = actionConf;
  const getFiled = dataCollectionAction(fieldMapping);
  return (action, runtimeFnScheduler) => {
    const set = getFiled(null, runtimeFnScheduler);
    const APBDSLItem = APBDSLFunctionItemWrap(
      genUpdateOfAPBDSL({
        set: [set],
        table,
        condition: {}
      })
    );
    return APBDSLItem;
  };
};

const genTableSelectFn = (actionConf: TableSelect) => {
  const { table } = actionConf;
  return (action, runtimeFnScheduler) => {
    const APBDSLItem = APBDSLFunctionItemWrap(
      genSelectOfAPBDSL({
        table,
      })
    );
    return APBDSLItem;
  };
};

export const APBDSLCURDAction = (conf: APBDSLCURD) => {
  const {
    actionName, actionId, actionOutput,
    actionOptions: { actionList, actionStep, businesscode }
  } = conf;
  const APBActionIds = Object.keys(actionList);

  const steps: any[] = [];
  const APBDSL = {
    businesscode,
    steps
  };
  APBActionIds.forEach((id) => {
    const fn = normalCURDActionParseScheduler(actionList[id]);
    steps.push(fn);
  });
  return (a, runtimeFnScheduler) => {
    const action = {
      type: 'APBDSLCURDAction',
      businesscode
    };
    /** 生成很多函数? */
    APBDSL.steps = steps.map((fn) => fn(action, runtimeFnScheduler));
    return runtimeFnScheduler.current({
      type: 'APBDSLrequest',
      params: [APBDSL],
      action,
      actionName,
    });
  };
};
