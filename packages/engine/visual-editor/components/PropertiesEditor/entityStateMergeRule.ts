/* eslint-disable no-param-reassign */
import produce from 'immer';
import { WidgetEntityState, PropItemMeta } from "../../data-structure";

interface EntityStateItemParams {
  value: any
  propItemMeta: PropItemMeta
}

type EntityStateMergeRule = (
  srcEntityState: WidgetEntityState,
  entityStateItemParams: EntityStateItemParams
) => WidgetEntityState

/**
 * 合并实例状态的规则
 *
 * @param srcState
 * @param param1
 */
export const entityStateMergeRule: EntityStateMergeRule = (
  srcEntityState = {}, entityStateItemParams
) => {
  const { value, propItemMeta } = entityStateItemParams;
  const srcEntityStateCopy = srcEntityState;
  const { whichAttr } = propItemMeta;

  const resState = produce(srcEntityStateCopy, (darftData) => {
    darftData[whichAttr] = value || null;
  });

  return resState;
};
