import {
  EditorComponentEntity, EditorEntityState, EditorPageEntity
} from "../../types";

export const INIT_APP = 'INIT_APP';
export interface InitAppAction {
  type: typeof INIT_APP
  entity: EditorComponentEntity
}

/**
 * 初始化组件类的状态
 */
export const InitApp = (
  entity: EditorComponentEntity
): InitAppAction => {
  return {
    type: INIT_APP,
    entity
  };
};

export const CLEAR_SELECT = 'CLEAR_SELECT';
export interface ClearSelectAction {
  type: typeof CLEAR_SELECT
}

/**
 * 初始化组件类的状态
 */
export const ClearSelect = (
): ClearSelectAction => {
  return {
    type: CLEAR_SELECT,
  };
};

/// /////////////////

export const INIT_ENTITY_STATE = 'INIT_ENTITY_STATE';
export interface InitEntityStateAction {
  type: typeof INIT_ENTITY_STATE
  entity: EditorComponentEntity
  defaultEntityState
}

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

export const SELECT_ENTITY = 'SELECT_ENTITY';
export interface SelectEntityAction {
  type: typeof SELECT_ENTITY
  entity: EditorComponentEntity
}

/**
 * 选择组件实例
 */
export const SelectEntity = (
  entity: EditorComponentEntity | EditorPageEntity
): SelectEntityAction => {
  return {
    type: SELECT_ENTITY,
    entity
  };
};

/// /////////////////

export const UPDATE_ENTITY_STATE = 'UPDATE_ENTITY_STATE';
export interface UpdateEntityStateAction {
  type: typeof UPDATE_ENTITY_STATE
  entityID: string,
  formState: EditorEntityState
}

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
  InitApp: typeof InitApp
  SelectEntity: typeof SelectEntity
  InitEntityState: typeof InitEntityState
  UpdateEntityState: typeof UpdateEntityState
}
