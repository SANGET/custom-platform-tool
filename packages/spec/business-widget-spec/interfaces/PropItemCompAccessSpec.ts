import { BasicUIAccessSpec } from "./basic";

export type ChangeEntityState = (value: any) => void

/**
 * 属性项的组件的接入标准
 */
export interface PropItemCompAccessSpec extends BasicUIAccessSpec {
  /** 用于渲染的组件 */
  render: (widgetEntityState, changeEntityState: ChangeEntityState) => JSX.Element
}
