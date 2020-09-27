import { produce } from "immer";
import {
  PropItemConfig, WidgetEntity,
  PropItemType, PageStageEntity
} from "../../data-structure";

/**
 * 提取 prop item config
 */
export const extractPropConfig = (
  propItemConfigFunc: PropItemConfig,
  entity: WidgetEntity,
  extendProps?
): PropItemType => {
  if (typeof propItemConfigFunc === 'function') {
    return Object.assign({}, propItemConfigFunc(produce(entity, (draft) => draft)), extendProps);
  }
  return propItemConfigFunc;
};
