/**
 * 基础的 UI 接入规范
 */
export interface BasicUIAccessSpec {
  /** 组件的名称 */
  name: string
  /** 是否符合预期 */
  unexpected?: boolean
  /** 挂载时的回调 */
  didMount?: () => void
  /** 被卸载时的回调 */
  didUnmount?: () => void
}

/**
 * 不符合预期的组件
 */
export interface UnexpectedWidgetSpec {
  /** 未符合预期 */
  unexpected: true
}
