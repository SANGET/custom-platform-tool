import {
  SELECT_ENTITY, INIT_ENTITY_STATE, SelectEntity,
  SelectEntityAction, InitEntityStateAction,
  UPDATE_ENTITY_STATE, UpdateEntityStateAction, INIT_APP, CLEAR_SELECT,
  ClearSelectAction, InitAppAction
} from "../actions/canvas";
import { EditorEntity, EntitiesStateStore, EditorEntityState } from "../../types";

/**
 * 选中的组件实例的数据结构
 */
export interface SelectEntityState {
  /** 选中的组件实例 ID */
  activeEntityID: string,
  /** 选中的组件实例 */
  activeEntity?: EditorEntity
  /** 可支持多选 */
  selectedList: {
    [id: string]: EditorEntity
  }
}

export const defaultSelectedEntities = {
  selectedList: {},
  activeEntityID: '',
  activeEntity: undefined
};

/**
 * 组件选择状态管理。如果组件未被实例化，则实例化后被选择
 */
export function selectedEntitiesReducer(
  state: SelectEntityState = defaultSelectedEntities,
  action: SelectEntityAction | ClearSelectAction | InitAppAction
) {
  switch (action.type) {
    case INIT_APP:
      return defaultSelectedEntities;
    case CLEAR_SELECT:
      return defaultSelectedEntities;
    case SELECT_ENTITY:
      const { entity } = action;
      const entityID = entity.id;
      return {
        selectedList: {
          [entityID]: entity
        },
        activeEntityID: entityID,
        activeEntity: entity
      };
      // case INIT_ENTITY_STATE:

    //   return;
    default:
      return state;
  }
}

/**
 * 用于存储组件实例的状态集合
 */
export function entitiesStateStoreReducer(
  state: EntitiesStateStore = {},
  action: InitEntityStateAction | UpdateEntityStateAction
): EntitiesStateStore {
  switch (action.type) {
    case UPDATE_ENTITY_STATE:
      const { entityID, formState } = action;
      return {
        ...state,
        [entityID]: {
          ...formState
        }
      };
    case INIT_ENTITY_STATE:
      const { entity, defaultEntityState } = action;
      return {
        ...state,
        [entity.id]: defaultEntityState
      };
    default:
      return state;
  }
}
