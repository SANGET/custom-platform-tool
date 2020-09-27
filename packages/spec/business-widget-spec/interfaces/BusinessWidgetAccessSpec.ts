import { BasicUIAccessSpec } from "./basic";

/**
 * 业务组件的接入标准，配置与应用都需要 implement 该接口，即可达到接入一次组件即可
 */
export interface BusinessWidgetAccessSpec extends BasicUIAccessSpec {
  propEditor?: (widgetState) => JSX.Element
  /** 用于渲染的组件 */
  render: (widgetState) => JSX.Element
}
