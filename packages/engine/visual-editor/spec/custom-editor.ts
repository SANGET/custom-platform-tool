import { ChangeEntityState, WidgetEntityState } from "../data-structure";

/**
 * 自定义编辑器的 ctx
 */
export interface CustomEditorCtx {
  entityState: WidgetEntityState
  changeEntityState: ChangeEntityState
  onSubmit: () => void
}

export type CustomEditor = (customEditorCtx: CustomEditorCtx) => JSX.Element
