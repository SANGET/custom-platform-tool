import { produce } from "immer";
import {
  PropItemMeta, WidgetEntity,
  PropItemCompAccessSpec, PageStageEntity
} from "../../data-structure";

/**
 * 提取 prop item config
 */
export const takePropItemConfig = (
  propItemConfig: PropItemCompAccessSpec,
  extendProps?
): PropItemMeta => {
  if (!propItemConfig) return null;
  const propItemMeta = produce(propItemConfig, (draft) => {
    Object.assign(draft, extendProps || {});
  });
  return propItemMeta;
};
