import { produce } from "immer";
import {
  PropItemMeta, WidgetEntity,
  PropItemCompAccessSpec, PageStageEntity
} from "../../data-structure";

/**
 * 提取 prop item config
 */
export const extractPropConfig = (
  propItemConfigFunc: PropItemCompAccessSpec,
  entity: WidgetEntity,
  extendProps?
): PropItemMeta => {
  if (typeof propItemConfigFunc === 'function') {
    const _entity = produce(entity, (draft) => draft);
    return propItemConfigFunc(_entity);
  }
  return propItemConfigFunc;
};
