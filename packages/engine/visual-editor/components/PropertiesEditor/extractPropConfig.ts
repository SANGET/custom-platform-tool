import { produce } from "immer";
import { PropertyItemConfigFunc, EditorComponentEntity, EditorPropertyItem } from "../../types";

/**
 * 提取 prop config
 */
export const extractPropConfig = (
  propItemConfigFunc: PropertyItemConfigFunc,
  entity: EditorComponentEntity
): EditorPropertyItem => {
  if (typeof propItemConfigFunc === 'function') {
    return propItemConfigFunc(produce(entity, (draft) => draft));
  }
  return propItemConfigFunc;
};
