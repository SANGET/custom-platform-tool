
/** 元素基础描述 */
export interface ElementAST {
  /** ID */
  id: string;
  /** 元素类型，不是指 html 的 tag */
  type: string;
  // /** 给元素的属性 */
  // attr?: {};
  /** 元素的生命周期 */
  // lifecycle?: {
  //   onMount?: ActionTypes;
  //   onUnmount?: ActionTypes;
  // };
}
