import { useState } from "react";
import { EditorEntityState, EditorPropertyItem } from "../../types";
import { increaseID } from "../../utils";

export type UpdateEntityStateCallback = (
  propItemConfig: EditorPropertyItem,
  value: any,
) => void

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
const getStyle = ({ value, propItemConfig }: EntityStateItemParams) => {
  if (propItemConfig.type === 'style') {
    const { target } = propItemConfig;
    return {
      [target]: value
    };
  }
};

/**
 * 合并通用属性
 */
const mergeGeneralProp = ({ value, propItemConfig }: EntityStateItemParams) => {
  if (propItemConfig.type === 'general') {
    const { target } = propItemConfig;
    return {
      [target]: value
    };
  }
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
  console.log(propItemConfig);
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
/**
 * 存储属性编辑器产出的表单数据
 */
const useEntityState = (defaultEntityState: EditorEntityState = {
}): [
  EditorEntityState, UpdateEntityStateCallback
] => {
  const [entityState, setFormState] = useState<EditorEntityState>(defaultEntityState);

  const updateEntityState: UpdateEntityStateCallback = (propItemConfig, value) => {
    /**
     * 属性合并规则
     */
    const nextState = entityStateMergeRule(entityState, { propItemConfig, value });
    setFormState(nextState);
  };

  return [
    entityState, updateEntityState
  ];
};

export default useEntityState;
