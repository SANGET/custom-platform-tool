import { BusinessWidgetAccessSpec } from './interfaces';
import * as Widgets from './Widgets';

const getWidgetSpecName = (widgetType) => `${widgetType}Spec`;

const getWidgetSpec = (
  widgetType
) => Widgets[getWidgetSpecName(widgetType)];

export const getWidget = (widgetType: string): BusinessWidgetAccessSpec => {
  // console.log(widgetType);
  const WidgetConfig = getWidgetSpec(widgetType);
  if (typeof WidgetConfig === 'function') {
    return new WidgetConfig();
  }
  return {};
};
