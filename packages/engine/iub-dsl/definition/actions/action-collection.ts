import { CommonCondition } from "..";
import { UpdateState, FeedBack, DataCollection } from "./sys-actions";
import { APBDSLCURD } from './business-actions';

export interface BasicActionConf extends CommonCondition {
  actionName: string;
}

export type ActionsDef = UpdateState | FeedBack | DataCollection | APBDSLCURD

/** APB动作得子流程 */
// export type ApbActionFn = UpdateState | FeedBack

/** TODO: 完全加入流程控制再考虑 */
