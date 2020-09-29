import { CommonCondition } from "..";
import { ApbAction } from "./apb-action";
import { UpdateState } from "./sys-actions/state-action";
import { ActionsFlow } from "./action-flow";
import { FeedBack } from "./sys-actions/feedback-action";

export interface BasicActionConf extends CommonCondition {
  actionName: string;
}

export type ActionFn = UpdateState | FeedBack

/** APB动作得子流程 */
// export type ApbActionFn = UpdateState | FeedBack

/** TODO: 完全加入流程控制再考虑 */
