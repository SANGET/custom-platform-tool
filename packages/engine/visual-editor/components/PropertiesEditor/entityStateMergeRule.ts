/* eslint-disable no-param-reassign */
import produce from 'immer';
import { WidgetEntityState, NextEntityState } from "../../data-structure";

/**
 * 合并实例状态的规则
 *
 * TODO: 完善更新链路
 *
 * @param srcState
 * @param param1
 */
export const entityStateMergeRule = (
  srcEntityState: WidgetEntityState = {},
  entityStateItemParams: NextEntityState[]
): WidgetEntityState => {
  const resState = produce(srcEntityState, (darftData) => {
    entityStateItemParams.forEach((param) => {
      const { value, attr } = param;

      darftData[attr] = value || null;
    });
  });

  return resState;
};
