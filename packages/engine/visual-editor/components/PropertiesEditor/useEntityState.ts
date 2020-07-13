import { useState } from "react";
import { EditorEntityState, EditorPropertyItem } from "../../types";
import { increaseID } from "../CanvasStage";

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
 * @important 重要模块
 *
 * 合并实例状态的规则
 *
 * @param srcState
 * @param param1
 */
const entityStateMergeRule: EntityStateMergeRule = (srcEntityState, entityStateItemParams) => {
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
    });

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
    const nextState = entityStateMergeRule(entityState, { propItemConfig, value });
    // console.log(propItemConfig);
    setFormState(nextState);
    // setFormState({
    //   ...entityState,
    //   [propItemID]: {
    //     propType,
    //     value
    //   }
    // });
  };

  return [
    entityState, updateEntityState
  ];
};

export default useEntityState;
