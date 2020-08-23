import {
  EditorEntityState, EditorEntity
} from "../../types";

/// app /////////////////

export const INIT_APP = 'app/init';
export interface InitAppAction {
  type: typeof INIT_APP
  compPanelData
  compClassData
  propItemsData
  pagePropsData
  pageData
}

/**
 * 初始化应用数据
 */
export const InitApp = ({
  /** 组件类面板数据 */
  compPanelData,
  compClassData,
  propItemsData,
  pagePropsData,
  pageData,
}): InitAppAction => {
  return {
    type: INIT_APP,
    compPanelData,
    compClassData,
    propItemsData,
    pagePropsData,
    pageData,
  };
};

/// entity /////////////////

/**
 * 初始化组件类的状态
 */
export const UNSELECT_ENTITY = 'entity/unselect';
export interface UnselectEntityAction {
  type: typeof UNSELECT_ENTITY
}

export const UnselectEntity = (
): UnselectEntityAction => {
  return {
    type: UNSELECT_ENTITY,
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
