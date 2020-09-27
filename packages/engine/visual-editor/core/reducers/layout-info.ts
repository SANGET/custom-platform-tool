import update from 'immutability-helper';
import produce from 'immer';
import { LayoutInfoActionReducerState, FlatLayoutItems } from "../../data-structure";
import {
  ADD_ENTITY, SET_LAYOUT_STATE, DEL_ENTITY,
  AddEntityAction, DelEntityAction, SetLayoutAction,
  SortingEntityAction,
  SORTING_ENTITY,
  UPDATE_ENTITY_STATE,
  UpdateEntityStateAction,
  InitEntityStateAction,
  INIT_ENTITY_STATE,
  INIT_APP,
  InitAppAction
} from '../actions';
import { getItemFromNestingItemsByBody } from '../utils';

/**
 * action types
 */
export type LayoutInfoActionReducerAction =
  AddEntityAction |
  DelEntityAction |
  SetLayoutAction |
  SortingEntityAction |
  UpdateEntityStateAction |
  InitEntityStateAction |
  InitAppAction

// /**
//  * state 的数据结构
//  */
// export interface LayoutInfoActionReducerState {
//   [entityID: string]: WidgetEntity
// }

/**
 * 用于处理布局信息的 reducer
 */
export const layoutInfoReducer = (
  state: LayoutInfoActionReducerState = [],
  action: LayoutInfoActionReducerAction
): LayoutInfoActionReducerState => {
  switch (action.type) {
    case INIT_APP:
      const { pageContent } = action;
      return produce(pageContent, (draft) => (draft ? draft.content : state));
    case ADD_ENTITY:
      const { entity: addEntity, idx } = action;
      const addNextState = update(state, {
        $splice: [
          [idx, 1, addEntity],
        ],
      });

      return addNextState;
    case SORTING_ENTITY:
      const {
        dragIndex, hoverIndex, nestingInfo,
        entity: sortEntity, replace
      } = action;
      const nextStateForSorting = update(state, {
        $splice: [
          [dragIndex, replace ? 0 : 1],
          [hoverIndex, 0, sortEntity],
        ],
      });
      return nextStateForSorting;
    case SET_LAYOUT_STATE:
      const { state: _state } = action;
      return _state;
    case DEL_ENTITY:
      return update(state, {
        $splice: [
          [action.idx, 1],
        ],
      });
    case INIT_ENTITY_STATE:
      const { selectedEntityInfo: initSInfo, defaultEntityState } = action;
      const { nestingInfo: initIdx } = initSInfo;
      const nextStateInit = produce(state, (draftState) => {
        const targetData = getItemFromNestingItemsByBody(draftState, initIdx);
        // eslint-disable-next-line no-param-reassign
        targetData.propState = defaultEntityState;
        return draftState;
      });
      return nextStateInit;
    case UPDATE_ENTITY_STATE:
      const { targetEntity: updateSInfo, formState } = action;
      const { nestingInfo: updateIdx } = updateSInfo;
      return produce(state, (draftState) => {
        const targetData = getItemFromNestingItemsByBody(draftState, updateIdx);
        targetData.propState = formState;
        return draftState;
      });
    default:
      return state;
  }
};

/**
 * 将嵌套的数组转为 nodeTree 结构
 */
const flatArrayToNode = (items: any[], idKey = 'id') => {
  const array = items.flat();
  const resTree = {};
  for (const item of array) {
    resTree[item[idKey]] = item;
  }
  return resTree;
};

export function flatLayoutItemsReducer(
  state: FlatLayoutItems = {},
  action: LayoutInfoActionReducerAction
): FlatLayoutItems {
  switch (action.type) {
    case INIT_APP:
      const { pageContent } = action;
      if (pageContent?.content) {
        const flatContent = flatArrayToNode(pageContent.content);
        return flatContent;
      }
      return state;
    case ADD_ENTITY:
      const { entity } = action;
      return {
        ...state,
        [entity.id]: entity
      };
    case UPDATE_ENTITY_STATE:
      const { targetEntity: { entity: updateEntity }, formState } = action;
      const { id: updateId } = updateEntity;
      return produce(state, (draftState) => {
        // eslint-disable-next-line no-param-reassign
        draftState[updateId].propState = formState;
        return draftState;
      });
    case DEL_ENTITY:
      return produce(state, (draft) => {
        const { idx, entity: delE } = action;
        // eslint-disable-next-line no-param-reassign
        delete draft[delE.id];
        return draft;
      });
    default:
      return state;
  }
}
