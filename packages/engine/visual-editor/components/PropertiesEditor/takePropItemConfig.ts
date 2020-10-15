import { produce } from "immer";
import {
  PropItemMeta, WidgetEntity,
  PropItemCompAccessSpec, PageStageEntity
} from "../../data-structure";

/**
 * 提取 prop item config
 */
export const takePropItemConfig = (
  propItemConfigFunc: PropItemCompAccessSpec,
  entity: WidgetEntity,
  extendProps?
): PropItemMeta => {
  if (typeof propItemConfigFunc === 'function') {
    const _entity = produce(entity, (draft) => draft);
    const propItemMeta = propItemConfigFunc(_entity);
    Object.assign(propItemMeta, extendProps);
    return propItemMeta;
  }
  return propItemConfigFunc;
};
