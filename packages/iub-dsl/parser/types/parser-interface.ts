import { TypeOfIUBDSL } from "@iub-dsl/core/types";
import { ComponentElement } from '@iub-dsl/core/types/component/collection';
import { ActionFlow } from '@iub-dsl/core/types/actions/action-collection';

// TODO: 设计 context
export interface ContextOfIUBDSL {
  setContext: (currContext: ContextOfIUBDSL) => ContextOfIUBDSL;
}

export interface ParserParamsOfIUBDSL {
  dsl: TypeOfIUBDSL;
  /** 验证 UI 是否可用 */
  authUI: (UIID: string) => boolean;
  /** context */
  context: ContextOfIUBDSL;
}

export interface ParserBindActions {
  context: ContextOfIUBDSL;
  bindAction: (actionID: string) => ActionFlow;
  bindComponent: (componentID: string) => ComponentElement;
  authUI: Function;
}
