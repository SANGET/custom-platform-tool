import {
  EditorComponentEntity, EditorEntityState, EditorPageEntity, EditorEntity
} from "../../types";

export const INIT_APP = 'INIT_APP';
export interface InitAppAction {
  type: typeof INIT_APP
  entity: EditorEntity
}

/**
 * 初始化组件类的状态
 */
export const InitApp = (
  entity: EditorEntity
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

export const SELECT_ENTITY = 'SELECT_ENTITY';
export interface SelectEntityAction {
  type: typeof SELECT_ENTITY
  entity: EditorEntity
}

/**
 * 选择组件实例
 */
export const SelectEntity = (
  entity: EditorEntity
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
  entity: EditorEntity,
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
