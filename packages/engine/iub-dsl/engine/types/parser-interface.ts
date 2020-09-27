/**
 * 解析器通用的 interface
 */

import { TypeOfIUBDSL } from "@iub-dsl/definition";
import { ComponentElement } from '@iub-dsl/definition/component/collection';

// TODO: 设计 context
export interface ContextOfIUBDSL {
  setContext: (currContext: ContextOfIUBDSL) => ContextOfIUBDSL;
  /** 验证 UI 是否可用 */
  authUI: (UIID: string) => boolean;
  /** 远端通讯模块 */
  requestAPI: any;
}

export interface ParserParamsOfIUBDSL {
  dsl: TypeOfIUBDSL;
  /** context */
  context: ContextOfIUBDSL;
}

export interface ParserContextGroup {
  context: ContextOfIUBDSL;
  bindAction: (actionID: string) => any;
  bindComponent: (componentID: string) => ComponentElement;
}
