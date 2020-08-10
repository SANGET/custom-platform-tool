import { EditorComponentEntity, EditorEntityState } from "../../types";

export interface InitEntityStateAction {
  type: typeof INIT_ENTITY_STATE
  entity: EditorComponentEntity
  defaultEntityState
}

export const INIT_ENTITY_STATE = 'INIT_ENTITY_STATE';
/**
 * 初始化组件类的状态
 */
export const InitEntityState = (
  entity: EditorComponentEntity,
  defaultEntityState
): InitEntityStateAction => {
  return {
    type: INIT_ENTITY_STATE,
    entity,
    defaultEntityState
  };
};

export interface SelectEntityAction {
  type: typeof SELECT_ENTITY
  entity: EditorComponentEntity
}

export const SELECT_ENTITY = 'SELECT_ENTITY';
/**
 * 选择组件实例
 */
export const SelectEntity = (entity: EditorComponentEntity): SelectEntityAction => {
  return {
    type: SELECT_ENTITY,
    entity
  };
};

/// /////////////////

export interface UpdateEntityStateAction {
  type: typeof UPDATE_ENTITY_STATE
  entityID: string,
  formState: EditorEntityState
}

export const UPDATE_ENTITY_STATE = 'UPDATE_ENTITY_STATE';
/**
 * 更新组件实例的状态
 */
export const UpdateEntityState = (
  entity: EditorComponentEntity,
  formState: EditorEntityState
): UpdateEntityStateAction => {
  return {
    type: UPDATE_ENTITY_STATE,
    entityID: entity.id,
    formState
  };
};

/// /////////////////

/**
 * 返回合成的 dispatcher 类型，提供给连接 redux 的组件使用
 */
export interface Dispatcher {
  SelectEntity: typeof SelectEntity
  InitEntityState: typeof InitEntityState
  UpdateEntityState: typeof UpdateEntityState
}
