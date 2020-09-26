/**
 * 业务组件的接入标准，配置与应用都需要 implement 该接口，即可达到接入一次组件即可
 */
export interface BusinessWidgetAccessSpec {
  name: string
  /** 组件挂载的回调 */
  didMount?: () => void
  propEditor?: (props) => JSX.Element
  /** 用于渲染的组件 */
  render: (props) => JSX.Element
}
