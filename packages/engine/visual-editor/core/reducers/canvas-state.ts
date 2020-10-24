import {
  SELECT_ENTITY, INIT_ENTITY_STATE,
  SelectEntityAction, INIT_APP, UNSELECT_ENTITY,
  UnselectEntityAction, InitAppAction, ADD_ENTITY, AddEntityAction,
  SORTING_ENTITY, SortingEntityAction
} from "../actions";
import { SelectEntityState } from "../types";

export const defaultSelectedEntities: SelectEntityState = {
  selectedList: {},
  id: '',
  nestingInfo: [],
  entity: undefined
};

type SelectedEntitiesActions =
  SelectEntityAction |
  UnselectEntityAction |
  InitAppAction |
  AddEntityAction |
  SortingEntityAction

/**
 * 组件选择状态管理。如果组件未被实例化，则实例化后被选择
 */
export function selectedInfoReducer(
  state: SelectEntityState = defaultSelectedEntities,
  action: SelectedEntitiesActions
): SelectEntityState {
  switch (action.type) {
    case INIT_APP:
      return defaultSelectedEntities;
    case UNSELECT_ENTITY:
      return defaultSelectedEntities;
    case SORTING_ENTITY:
      return state;
    case ADD_ENTITY:
    case SELECT_ENTITY:
      const { entity, idx, nestingInfo } = action;
      const entityID = entity.id;
      return {
        nestingInfo: nestingInfo || [idx],
        index: idx,
        id: entityID,
      };
    default:
      return state;
  }
}
