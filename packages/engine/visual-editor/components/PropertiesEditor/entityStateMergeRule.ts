/* eslint-disable no-param-reassign */
import produce from 'immer';
import { WidgetEntityState, PropItemType } from "../../data-structure";

interface EntityStateItemParams {
  value: any,
  propItemConfig: PropItemType
}

type EntityStateMergeRule = (
  srcEntityState: WidgetEntityState,
  entityStateItemParams: EntityStateItemParams
) => WidgetEntityState

/**
 * 提取属性中的 style
 */
export const getStyle = ({
  value,
  propItemConfig
}: EntityStateItemParams) => {
  if (propItemConfig.whichAttr === 'style') {
    const { target } = propItemConfig;
    return {
      [target]: value
    };
  }
  return undefined;
};

/**
 * 合并通用属性
 */
export const mergeGeneralProp = ({
  value,
  propItemConfig
}: EntityStateItemParams) => {
  if (propItemConfig.whichAttr === 'general') {
    const { target } = propItemConfig;
    return {
      [target]: value
    };
  }
  return undefined;
};

/**
 * @author zxj
 * @important 重要模块
 *
 * 合并实例状态的规则
 *
 * @param srcState
 * @param param1
 */
export const entityStateMergeRule: EntityStateMergeRule = (
  srcEntityState = {}, entityStateItemParams
) => {
  const { value, propItemConfig } = entityStateItemParams;
  const srcEntityStateCopy = srcEntityState;
  const { whichAttr } = propItemConfig;

  const resState = produce(srcEntityStateCopy, (darftData) => {
    // darftData.style = Object.assign({}, srcEntityState.style, getStyle(entityStateItemParams));
    darftData[whichAttr] = value;
    // Object.assign(darftData, mergeGeneralProp(entityStateItemParams));
  });

  return resState;
};
