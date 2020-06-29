/**
 * 解析器通用的 interface
 */

import { TypeOfIUBDSL } from "@iub-dsl/core/types";
import { ComponentElement } from '@iub-dsl/core/types/component/collection';
import { ActionFlow } from '@iub-dsl/core/types/actions/action-collection';
import { RequestAPIOfIUBDSL } from "./request-types";

// TODO: 设计 context
export interface ContextOfIUBDSL {
  setContext: (currContext: ContextOfIUBDSL) => ContextOfIUBDSL;
  /** 验证 UI 是否可用 */
  authUI: (UIID: string) => boolean;
  /** 远端通讯模块 */
  requestAPI: RequestAPIOfIUBDSL;
}

export interface ParserParamsOfIUBDSL {
  dsl: TypeOfIUBDSL;
  /** context */
  context: ContextOfIUBDSL;
  pageContext?: any;
  appContext?: any;
}

export interface ParserContextGroup {
  context: ContextOfIUBDSL;
  bindAction: (actionID: string) => ActionFlow;
  bindComponent: (componentID: string) => ComponentElement;
}
