import update from 'immutability-helper';
import { EditorComponentEntity } from "../../types";

interface AddElementAction {
  type: 'add'
  entity: EditorComponentEntity
  idx: number
}
interface UpdateElementAction {
  type: 'motify'
  entity: EditorComponentEntity
}
interface DelElementAction {
  type: 'del'
  entityIdx: number
}
interface SetElementAction {
  type: 'set'
  state: LayoutInfoActionReducerState
}

/**
 * action types
 */
export type LayoutInfoActionReducerAction =
  AddElementAction |
  UpdateElementAction |
  SetElementAction |
  DelElementAction

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
 * 布局信息 reducer 的类型
 */
export type LayoutInfoActionReducer = (
  state: LayoutInfoActionReducerState,
  action: LayoutInfoActionReducerAction
) => LayoutInfoActionReducerState

/**
 * 用于处理布局信息的 reducer
 */
export const layoutInfoReducer: LayoutInfoActionReducer = (
  state = [],
  action
) => {
  switch (action.type) {
    case 'add':
      const { entity: addEntity, idx } = action;
      /** 防止嵌套 */
      if (!!addEntity.id && addEntity.id === addEntity.parentID) {
        console.log('nesting');
        return state;
      }
      const addNextState = update(state, {
        $splice: [
          [idx, 1, addEntity],
        ],
      });

      return addNextState;
    case 'motify':
      const { entity: updateEntity } = action;
      const nextState = {
        ...state,
      };
      nextState[updateEntity.id] = updateEntity;
      return nextState;
    case 'set':
      const { state: _state } = action;
      return _state;
    case 'del':
      return update(state, {
        $splice: [
          [action.entityIdx, 1],
        ],
      });
      // return state;
    default:
      throw new Error();
  }
};
