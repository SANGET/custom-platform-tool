import { CommonCondition } from './../../../definition/public/index';
import { ApbAction } from "./apb-action";
import { UpdateState } from "./state-action";
import { ActionsFlow } from "./action-flow";
import { FeedBack } from "./feedback-action";
// import { QuoteEffectAction } from "./quote-effect-action";

// export interface FlowItem {
//   /** 用于标识此流程产生出的值赋予的变量的名称 */
//   variable: string;
//   /** 此流程的执行表达式 */
//   expression: ExpressionTypes;
//   /** 是否注册到页面上下文 */
//   isReturn?: boolean;
// }

// /** 动作描述 */
// export type ActionFlow = {
//   flowItems: {
//     [flowItemID: string]: FlowItem;
//   };
//   flowCondition: {
//     [flowItemID: string]: FlowItem;
//   };
//   flowControl: string;
// };

export interface BasicActionConf extends CommonCondition {
  actionName: string;
}

export type ActionFn = ApbAction | UpdateState | FeedBack

/** APB动作得子流程 */
export type ApbActionFn = UpdateState | FeedBack

/** TODO: 完全加入流程控制再考虑 */
// interface ActionsCollection {
//   flow: ActionsFlow;
//   flowItem: {
//     [flowId: string]: ActionFn
//   }
// }
