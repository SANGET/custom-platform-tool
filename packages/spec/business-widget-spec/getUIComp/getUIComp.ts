import { UnexpectedWidgetMeta } from "../interfaces";

/**
 * 获取 UI 组件的 HOC
 * @param UICompData 所有的 UI 的引用
 * @param sufix 组件名的后缀
 */
export const getUICompHOC = <R>(UICompData, sufix = '') => {
  const getWidgetSpecName = (widgetType) => `${widgetType}${sufix}`;

  const getWidgetSpec = (
    widgetType
  ) => UICompData[getWidgetSpecName(widgetType)];

  return (widgetType: string): R | UnexpectedWidgetMeta => {
    const WidgetConfig = getWidgetSpec(widgetType);
    if (typeof WidgetConfig === 'function') {
      return WidgetConfig();
    }
    return {
      unexpected: true
    };
  };
};
