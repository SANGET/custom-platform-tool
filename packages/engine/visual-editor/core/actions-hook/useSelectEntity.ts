import { useState } from "react";
import { EditorComponentEntity } from "../../types";

/**
 * useSelectEntity 管理的 state 结构
 */
export interface SelectEntityState {
  activeID: string,
  activeEntity?: EditorComponentEntity
  selectedList: {
    [id: string]: EditorComponentEntity
  }
}

/**
 * SelectEntity 函数说明
 */
export type SelectEntity = (selectEntityParam: EditorComponentEntity) => void

/**
 * useSelectEntity 的返回值类型
 */
type RtnType = [SelectEntityState, SelectEntity]

const defaultState = {
  selectedList: {},
  activeID: '',
  activeEntity: undefined
};

/**
 * 组件选择状态管理。如果组件未被实例化，则实例化后被选择
 */
export const useSelectEntity = (
  initState = defaultState
): RtnType => {
  const [selectedEntities, setSelectedEntity] = useState<SelectEntityState>(initState);

  const selectEntity: SelectEntity = (entity) => {
    const { id } = entity;
    setSelectedEntity({
      selectedList: {
        [id]: entity
      },
      activeID: id,
      activeEntity: entity
    });
  };

  return [
    selectedEntities, selectEntity
  ];
};
