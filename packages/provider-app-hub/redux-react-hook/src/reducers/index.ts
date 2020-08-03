/*
 * @Author: your name
 * @Date: 2020-08-03 12:24:31
 * @LastEditTime: 2020-08-03 12:24:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\DataManager\src\reducers\index.ts
 */
import { Action, IState } from './store';

export default function reducer(
  state: IState | null | undefined,
  action: Action,
) {
  if (!state) {
    return null;
  }

  switch (action.type) {
    case 'add todo': {
      return {
        ...state,
        lastUpdated: Date.now(),
        todos: state.todos.concat(action.todo),
      };
    }

    case 'delete todo': {
      const todos = state.todos.slice();
      todos.splice(action.index, 1);
      return { ...state, lastUpdated: Date.now(), todos };
    }

    default:
      return state;
  }
}
