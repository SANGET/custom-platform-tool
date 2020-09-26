/**
 * 属性项的组件的接入标准
 */
export interface PropItemCompAccessSpec {
  /** 组件挂载的回调 */
  didMount?: () => void
  /** 用于渲染的组件 */
  render: (props) => JSX.Element
}
