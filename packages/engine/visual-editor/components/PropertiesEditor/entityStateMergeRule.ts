import { EditorEntityState, EditorPropertyItem } from "../../types";
import { increaseID } from "../../utils";

interface EntityStateItemParams {
  value: any,
  propItemConfig: EditorPropertyItem
}

type EntityStateMergeRule = (
  srcEntityState: EditorEntityState,
  entityStateItemParams: EntityStateItemParams
) => EditorEntityState

/**
 * 提取属性中的 style
 */
export const getStyle = ({
  value,
  propItemConfig
}: EntityStateItemParams) => {
  if (propItemConfig.type === 'style') {
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
  if (propItemConfig.type === 'general') {
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
  srcEntityState, entityStateItemParams
) => {
  const { value, propItemConfig } = entityStateItemParams;
  const srcEntityStateCopy = srcEntityState || {};
  const propID = propItemConfig.id;

  const resState: EditorEntityState = Object.assign({},
    srcEntityStateCopy,
    {
      propOriginState: Object.assign({}, srcEntityState.propOriginState, {
        [propID]: {
          value
        }
      }),
      style: Object.assign({}, srcEntityState.style, getStyle(entityStateItemParams)),
      dataID: srcEntityStateCopy.dataID ? srcEntityStateCopy.dataID : increaseID()
    }, mergeGeneralProp(entityStateItemParams));

  return resState;
};
