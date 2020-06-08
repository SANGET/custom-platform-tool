/**
 * 是指解析器在运行的过程中产生的上下文 context
 */
export interface ActionContext {
  type: string;
  data: {};
  expression: () => any;
  submit?: () => any;
}
/** 动作描述 */
export type Action = (context: ActionContext) => any;
