import {
  EditorComponentEntity, EditorEntityState, EditorPageEntity, EditorEntity
} from "../../types";

/// app /////////////////

export const INIT_APP = 'app/init';
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

/// entity /////////////////

export const CLEAR_SELECT = 'entity/unselect';
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

export const SELECT_ENTITY = 'entity/select';
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

export const ADD_ENTITY = 'entity/add';
export interface AddEntityAction {
  type: typeof ADD_ENTITY
  entity: EditorEntity
}

/**
 * 添加组件实例
 */
export const AddEntity = (
  entity: EditorEntity
): AddEntityAction => {
  return {
    type: ADD_ENTITY,
    entity
  };
};

export const UPDATE_ENTITY = 'entity/update';
export interface UpdateEntityAction {
  type: typeof UPDATE_ENTITY
  entity: EditorEntity
}

/**
 * 更改组件实例
 */
export const UpdateEntity = (
  entity: EditorEntity
): UpdateEntityAction => {
  return {
    type: UPDATE_ENTITY,
    entity
  };
};

export const DEL_ENTITY = 'entity/del';
export interface DelEntityAction {
  type: typeof DEL_ENTITY
  entity: EditorEntity
}

/**
 * 删除组件实例
 */
export const DelEntity = (
  entity: EditorEntity
): DelEntityAction => {
  return {
    type: DEL_ENTITY,
    entity
  };
};

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
