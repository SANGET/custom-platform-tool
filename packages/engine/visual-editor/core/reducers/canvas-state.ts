import {
  SELECT_ENTITY, INIT_ENTITY_STATE,
  SelectEntityAction, InitEntityStateAction,
  UPDATE_ENTITY_STATE, UpdateEntityStateAction, INIT_APP, UNSELECT_ENTITY,
  UnselectEntityAction, InitAppAction, ADD_ENTITY, AddEntityAction
} from "../actions";
import { EditorEntity, EntitiesStateStore, EditorEntityState } from "../../types";
import { SelectEntityState } from "../types";

export const defaultSelectedEntities = {
  selectedList: {},
  activeEntityID: '',
  activeEntityNestingIdx: [],
  activeEntity: undefined
};

/**
 * 组件选择状态管理。如果组件未被实例化，则实例化后被选择
 */
export function selectedEntitiesReducer(
  state: SelectEntityState = defaultSelectedEntities,
  action: SelectEntityAction | UnselectEntityAction | InitAppAction | AddEntityAction
): SelectEntityState {
  switch (action.type) {
    case INIT_APP:
      return defaultSelectedEntities;
    case UNSELECT_ENTITY:
      return defaultSelectedEntities;
    case ADD_ENTITY:
    case SELECT_ENTITY:
      const { entity, idx } = action;
      const entityID = entity.id;
      return {
        // selectedList: {
        //   [entityID]: entity
        // },
        activeEntityNestingIdx: [idx],
        activeEntityIdx: idx,
        activeEntityID: entityID,
        // activeEntity: entity
      };
    default:
      return state;
  }
}

/**
 * 弃用
 *
 * 用于存储组件实例的状态集合
 */
// export function entitiesStateStoreReducer(
//   state: EntitiesStateStore = {},
//   action: InitEntityStateAction | UpdateEntityStateAction
// ): EntitiesStateStore {
//   switch (action.type) {
//     // case UPDATE_ENTITY_STATE:
//     //   const { entityID, formState } = action;
//     //   return {
//     //     ...state,
//     //     [entityID]: {
//     //       ...formState
//     //     }
//     //   };
//     // case INIT_ENTITY_STATE:
//     //   const { entity, defaultEntityState } = action;
//     //   return {
//     //     ...state,
//     //     [entity.id]: defaultEntityState
//     //   };
//     default:
//       return state;
//   }
// }
