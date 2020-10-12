import { ElemNestingInfo } from "@engine/layout-renderer";
import {
  WidgetEntity,
  WidgetEntityState
} from "../../data-structure";
import { SelectEntityState } from "../types";

/// entityState /////////////////

export const INIT_ENTITY_STATE = 'entityState/init';
export interface InitEntityStateAction {
  type: typeof INIT_ENTITY_STATE
  selectedEntityInfo: SelectEntityState
  defaultEntityState
}

/**
 * 初始化组件类的状态
 */
export const InitEntityState = (
  selectedEntityInfo: SelectEntityState,
  defaultEntityState
): InitEntityStateAction => {
  return {
    type: INIT_ENTITY_STATE,
    selectedEntityInfo,
    defaultEntityState
  };
};

export type UpdateTargetEntity = {
  nestingInfo: ElemNestingInfo
  entity: WidgetEntity
}
export const UPDATE_ENTITY_STATE = 'entityState/update';
export interface UpdateEntityStateAction {
  type: typeof UPDATE_ENTITY_STATE
  targetEntity: UpdateTargetEntity,
  formState: WidgetEntityState
}

/**
 * 更新组件实例的状态
 */
export const UpdateEntityState = (
  targetEntity: UpdateTargetEntity,
  formState: WidgetEntityState
): UpdateEntityStateAction => {
  return {
    type: UPDATE_ENTITY_STATE,
    targetEntity,
    formState
  };
};
