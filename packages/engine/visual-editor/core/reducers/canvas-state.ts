import {
  SELECT_ENTITY, INIT_ENTITY_STATE, SelectEntity,
  SelectEntityAction, InitEntityStateAction,
  UPDATE_ENTITY_STATE, UpdateEntityStateAction
} from "../actions/canvas";
import { EditorComponentEntity, EntitiesStateStore, EditorEntityState } from "../../types";

/**
 * 选中的组件实例的数据结构
 */
export interface SelectEntityState {
  activeID: string,
  activeEntity?: EditorComponentEntity
  selectedList: {
    [id: string]: EditorComponentEntity
  }
}

const defaultState = {
  selectedList: {},
  activeID: '',
  activeEntity: undefined
};

/**
 * 组件选择状态管理。如果组件未被实例化，则实例化后被选择
 */
export function selectedEntitiesReducer(
  state: SelectEntityState = defaultState,
  action: SelectEntityAction
) {
  switch (action.type) {
    case SELECT_ENTITY:
      const { entity } = action;
      const entityID = entity.id;
      return {
        selectedList: {
          [entityID]: entity
        },
        activeID: entityID,
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
