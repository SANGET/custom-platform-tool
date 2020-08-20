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

/**
 * 初始化组件类的状态
 */
export const CLEAR_SELECT = 'entity/unselect';
export interface ClearSelectAction {
  type: typeof CLEAR_SELECT
}

export const ClearSelect = (
): ClearSelectAction => {
  return {
    type: CLEAR_SELECT,
  };
};

/**
 * 选择组件实例
 */
export const SELECT_ENTITY = 'entity/select';
export interface SelectEntityAction {
  type: typeof SELECT_ENTITY
  entity: EditorEntity
}

export const SelectEntity = (
  entity: EditorEntity
): SelectEntityAction => {
  return {
    type: SELECT_ENTITY,
    entity
  };
};

/**
 * 添加组件实例
 */
export const ADD_ENTITY = 'entity/add';
export interface AddEntityAction {
  type: typeof ADD_ENTITY
  entity: EditorComponentEntity
  idx: number
}

export const AddEntity = (
  entity: EditorComponentEntity,
  idx
): AddEntityAction => {
  return {
    type: ADD_ENTITY,
    entity,
    idx
  };
};

/**
 * 更改组件实例
 */
export const MOTIFY_ENTITY = 'entity/motify';
export interface MotifyEntityAction {
  type: typeof MOTIFY_ENTITY
  entity: EditorComponentEntity
}

export const MotifyEntity = (
  entity: EditorComponentEntity
): MotifyEntityAction => {
  return {
    type: MOTIFY_ENTITY,
    entity
  };
};

/**
 * 删除组件实例
 */
export const DEL_ENTITY = 'entity/del';
export interface DelEntityAction {
  type: typeof DEL_ENTITY
  entityIdx: number
}

export const DelEntity = (
  entityIdx: number
): DelEntityAction => {
  return {
    type: DEL_ENTITY,
    entityIdx
  };
};

/**
 * 设置 layout info 的值
 */
export const SET_LAYOUT_STATE = 'layout/state/set';
export interface SetLayoutAction {
  type: typeof SET_LAYOUT_STATE
  state
}

export const SetLayoutInfo = (
  state
): SetLayoutAction => {
  return {
    type: SET_LAYOUT_STATE,
    state
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
