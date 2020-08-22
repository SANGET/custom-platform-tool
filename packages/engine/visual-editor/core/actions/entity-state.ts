import {
  EditorEntityState, EditorEntity
} from "../../types";

/// entityState /////////////////

export const INIT_ENTITY_STATE = 'entityState/init';
export interface InitEntityStateAction {
  type: typeof INIT_ENTITY_STATE
  entity: EditorEntity
  defaultEntityState
}

/**
 * 初始化组件类的状态
 */
export const InitEntityState = (
  entity: EditorEntity,
  defaultEntityState
): InitEntityStateAction => {
  return {
    type: INIT_ENTITY_STATE,
    entity,
    defaultEntityState
  };
};

export const UPDATE_ENTITY_STATE = 'entityState/update';
export interface UpdateEntityStateAction {
  type: typeof UPDATE_ENTITY_STATE
  entityID: string,
  formState: EditorEntityState
}

/**
 * 更新组件实例的状态
 */
export const UpdateEntityState = (
  entity: EditorEntity,
  formState: EditorEntityState
): UpdateEntityStateAction => {
  return {
    type: UPDATE_ENTITY_STATE,
    entityID: entity.id,
    formState
  };
};
