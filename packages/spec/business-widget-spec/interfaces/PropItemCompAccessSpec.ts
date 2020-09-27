import { BasicUIAccessSpec } from "./basic";

/**
 * 属性项的组件的接入标准
 */
export interface PropItemCompAccessSpec extends BasicUIAccessSpec {
  /** 用于渲染的组件 */
  render: (widgetEntityState, changeEntityState) => JSX.Element
}
