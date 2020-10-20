import { WidgetEntityState } from "@engine/visual-editor/data-structure";
import { CustomEditor } from "@engine/visual-editor/spec/custom-editor";

/**
 * 基础的 UI 接入规范
 */
export interface BusinessWidgetMeta {
  /** 组件的名称 */
  name: string
  /** 可编辑的属性, TODO: 需要一套校验可编辑属性的规则的工具 */
  editableProps: {
    [key: string]: unknown
  }
  /** 是否符合预期 */
  unexpected?: boolean
  /** 挂载时的回调 */
  didMount?: () => void
  /** 被卸载时的回调 */
  didUnmount?: () => void
  propEditor?: CustomEditor
  /** 用于渲染的组件 */
  render: (widgetState: WidgetEntityState) => JSX.Element
}

/**
 * 不符合预期的组件
 */
export interface UnexpectedWidgetMeta {
  /** 未符合预期 */
  unexpected: true
}

/**
 * 业务组件的接入标准，配置与应用都需要 implement 该接口，即可达到接入一次组件即可
 */
export type BusinessWidgetAccessSpec = () => BusinessWidgetMeta
