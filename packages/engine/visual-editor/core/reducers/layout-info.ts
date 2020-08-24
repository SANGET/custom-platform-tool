import update from 'immutability-helper';
import { EditorComponentEntity } from "../../types";
import {
  ADD_ENTITY, MOTIFY_ENTITY, SET_LAYOUT_STATE, DEL_ENTITY,
  AddEntityAction, MotifyEntityAction, DelEntityAction, SetLayoutAction,
  SortingEntityAction,
  SORTING_ENTITY
} from '../actions';

/**
 * action types
 */
export type LayoutInfoActionReducerAction =
  AddEntityAction |
  MotifyEntityAction |
  DelEntityAction |
  SetLayoutAction |
  SortingEntityAction

/**
 * state 的数据结构
 */
export type LayoutInfoActionReducerState = EditorComponentEntity[]
// /**
//  * state 的数据结构
//  */
// export interface LayoutInfoActionReducerState {
//   [entityID: string]: EditorComponentEntity
// }

/**
 * 用于处理布局信息的 reducer
 */
export const layoutInfoReducer = (
  state: LayoutInfoActionReducerState = [],
  action: LayoutInfoActionReducerAction
): LayoutInfoActionReducerState => {
  switch (action.type) {
    case ADD_ENTITY:
      const { entity: addEntity, idx } = action;
      /** 防止嵌套 */
      // if (!!addEntity.id && addEntity.id === addEntity.parentID) {
      //   console.log('nesting');
      //   return state;
      // }
      const addNextState = update(state, {
        $splice: [
          [idx, 1, addEntity],
        ],
      });

      return addNextState;
    case SORTING_ENTITY:
      const {
        dragIndex, hoverIndex, nestingInfo, entity: sortEntity, replace
      } = action;
      const nextStateForSorting = update(state, {
        $splice: [
          [dragIndex, replace ? 0 : 1],
          [hoverIndex, 0, sortEntity],
        ],
      });
      console.log(nextStateForSorting);
      return nextStateForSorting;
    case MOTIFY_ENTITY:
      const { entity: updateEntity } = action;
      const nextState = {
        ...state,
      };
      nextState[updateEntity.id] = updateEntity;
      return nextState;
    case SET_LAYOUT_STATE:
      const { state: _state } = action;
      return _state;
    case DEL_ENTITY:
      return update(state, {
        $splice: [
          [action.entityIdx, 1],
        ],
      });
    default:
      return state;
  }
};
