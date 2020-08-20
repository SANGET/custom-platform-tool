import { useState } from "react";
import { EditorEntityState, EditorPropertyItem } from "../../types";
import { entityStateMergeRule } from "./entityStateMergeRule";

export type UpdateEntityStateCallback = (
  propItemConfig: EditorPropertyItem,
  value: any,
) => void

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
    console.log(nextState);
    setFormState(nextState);
  };

  return [
    entityState, updateEntityState
  ];
};

export default useEntityState;
