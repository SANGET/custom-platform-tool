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

import { UpdateState, ActionsDef } from "@iub-dsl/definition/actions";

export const actionsCollectionParser = (actionCollection: { [actionId: string]: ActionsDef }) => {
  const actionIds = Object.keys(actionCollection);

  const actionParseRes = {};
  actionIds.forEach((key) => {
    actionParseRes[key] = actionsParserScheduler(actionCollection[key]);
  });

  return {
    actionIds,
    actionParseRes
  };
};

const actionsParserScheduler = (actionConf: ActionsDef) => {
  switch (actionConf.type) {
    case 'updateState':
      return updateStateAction(actionConf);
    default:
      console.error('err action');
      return () => {};
  }
};

/**
 * 单个action和多个action
 * 事件触发、标准输入
 * 1. 需要用到标准输入得, 不需要用到标准输入得
 * 2. 配置流程中的上下文的「流程引擎中识别」
 */
const updateStateAction = (conf: UpdateState) => {
  // 更新状态动作的配置和定义
  const { actionName, changeMapping, changeTarget } = conf;
  if (changeTarget) {
    return (action, { targetUpdateState }) => {
      // action, 标准得事件执行上下文, param2 运行时上下文
      targetUpdateState(changeTarget, action.changeValue);
    };
  }
  return () => {
  };
};

// 最重要的问题: 流程和隔离
