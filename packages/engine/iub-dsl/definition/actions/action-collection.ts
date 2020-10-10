import { CommonCondition } from "..";
import { ApbAction } from "./apb-action";
import { UpdateState, FeedBack } from "./sys-actions";
import { ActionsFlow } from "./action-flow";

export interface BasicActionConf extends CommonCondition {
  actionName: string;
}

export type ActionsDef = UpdateState | FeedBack

/** APB动作得子流程 */
// export type ApbActionFn = UpdateState | FeedBack

/** TODO: 完全加入流程控制再考虑 */
