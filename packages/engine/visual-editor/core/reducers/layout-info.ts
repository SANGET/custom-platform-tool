import { EditorComponentEntity } from "../../types";

interface AddElementAction {
  type: 'add'
  entity: EditorComponentEntity
}
interface UpdateElementAction {
  type: 'update'
  entity: EditorComponentEntity
}
interface DelElementAction {
  type: 'del'
  entity: EditorComponentEntity
}

/**
 * action types
 */
export type LayoutInfoActionReducerAction =
  AddElementAction |
  UpdateElementAction |
  DelElementAction

/**
 * state 的数据结构
 */
export interface LayoutInfoActionReducerState {
  [entityID: string]: EditorComponentEntity
}

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
export const layoutInfoActionReducer: LayoutInfoActionReducer = (
  state,
  action
) => {
  switch (action.type) {
    case 'add':
      const { entity: addEntity } = action;
      /** 防止嵌套 */
      if (!!addEntity.id && addEntity.id === addEntity.parentID) {
        console.log('nesting');
        return state;
      }

      return {
        ...state,
        [addEntity.id]: addEntity
      };
    case 'update':
      const { entity: updateEntity } = action;
      const nextState = {
        ...state,
      };
      nextState[updateEntity.id] = updateEntity;
      return nextState;
    case 'del':
      return state;
    default:
      throw new Error();
  }
};
