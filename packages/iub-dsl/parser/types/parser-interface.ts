import { TypeOfIUBDSL } from "@iub-dsl/core/types";

export interface ParserParamsOfIUBDSL {
  dsl: TypeOfIUBDSL;
  /** 验证 UI 是否可用 */
  authUI: (UIID: string) => boolean;
}
