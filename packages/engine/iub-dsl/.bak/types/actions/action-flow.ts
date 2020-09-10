import { CommonCondition } from "..";

export enum ActionFlowKeywork {
  GOTO = 'goto',
  FOR = 'for',
  OR = 'or',
  AND = 'and'

}
interface AndFlow<F = ActionsFlow> {
  actionId: string;
  /** 子流程类型 */
  childrenFlowType: ActionFlowKeywork.AND;
  childrenFlow?: F;
}
interface OrFlow<F = ActionsFlow> {
  actionId: string;
  /** 子流程类型 */
  childFlowType: ActionFlowKeywork.OR;
  childrenFlow?: F;
}
/** 循环的流程, 以及其他流程后续再完善 */
interface ForFlow<F = ActionsFlow> {
  actionId: string;
  num: number;
  condition: CommonCondition;
  /** 子流程类型 */
  childFlowType: ActionFlowKeywork.FOR;
  childrenFlow?: F;
}

/**
 * 1. 系统运行的流程
 * 2. apb运行的流程 「APB的运行,主要是因为依赖关系. 理论上可以依据系统运行流程进行运行」
*/
export type ActionsFlow = (AndFlow | OrFlow | ForFlow)[]
