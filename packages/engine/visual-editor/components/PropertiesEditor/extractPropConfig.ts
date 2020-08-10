import { mergeDeep } from "@infra/utils/tools";
import { PropertyItemConfigFunc, EditorComponentEntity, EditorPropertyItem } from "../../types";

/**
 * 提取 prop config
 */
export const extractPropConfig = (
  propItemConfig: PropertyItemConfigFunc,
  entity: EditorComponentEntity
): EditorPropertyItem => {
  if (typeof propItemConfig === 'function') {
    return propItemConfig(mergeDeep(entity));
  }
  return propItemConfig;
};
