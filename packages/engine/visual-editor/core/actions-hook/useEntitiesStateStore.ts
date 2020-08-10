import { useState } from "react";
import { EntitiesStateStore, EditorEntityState } from "../../types";

export type SaveEntitiesStateStore = (id: string, formState: EditorEntityState) => void

/**
 * 用于存储组件实例的状态集合
 *
 * TODO: 添加增删查改的类型
 */
export const useEntitiesStateStore = (defaultState: EntitiesStateStore = {}): [
  EntitiesStateStore, SaveEntitiesStateStore
] => {
  const [entitiesStateStore, setComponentPropStore] = useState(defaultState);

  const saveComponentPropStore: SaveEntitiesStateStore = (entityID, formState) => {
    setComponentPropStore({
      ...entitiesStateStore,
      [entityID]: {
        ...formState
      }
    });
  };

  return [
    entitiesStateStore, saveComponentPropStore
  ];
};

/**
 * 获取组件实例的默认属性
 */
export const getEntityDefaultState: EditorEntityState = (entity) => {
  return {};
};
