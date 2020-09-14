import { produce } from "immer";
import {
  PropertyItemConfigFunc, EditorComponentEntity,
  EditorPropertyItem, EditorPageEntity
} from "../../types";

/**
 * 提取 prop item config
 */
export const extractPropConfig = (
  propItemConfigFunc: PropertyItemConfigFunc,
  entity: EditorComponentEntity,
  extendProps?
): EditorPropertyItem => {
  if (typeof propItemConfigFunc === 'function') {
    return Object.assign({}, propItemConfigFunc(produce(entity, (draft) => draft)), extendProps);
  }
  return propItemConfigFunc;
};
