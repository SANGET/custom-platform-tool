import { useState } from "react";
import { WidgetEntityState, PropItemMeta } from "../../data-structure";
import { entityStateMergeRule } from "./entityStateMergeRule";

export type UpdateEntityStateCallback = (
  propItemConfig: PropItemMeta,
  value: any,
) => void

/**
 * 存储属性编辑器产出的表单数据
 */
const useEntityState = (defaultEntityState: WidgetEntityState = {
}): [
  WidgetEntityState, UpdateEntityStateCallback
] => {
  const [entityState, setFormState] = useState<WidgetEntityState>(defaultEntityState);

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
