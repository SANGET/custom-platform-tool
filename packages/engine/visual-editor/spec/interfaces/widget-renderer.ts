import { LayoutWrapperContext } from "@engine/layout-renderer";
import { BusinessWidgetAccessSpec } from "@spec/business-widget";
import { WidgetEntity, WidgetEntityState } from "../../data-structure";

/**
 * 包装器传给被包装的组件的 props
 */
export interface WidgetRendererProps extends LayoutWrapperContext {
  onClick: React.DOMAttributes<HTMLDivElement>['onClick']
  entity: WidgetEntity
  entityState: WidgetEntityState
  businessWidgetConfig: BusinessWidgetAccessSpec
}
