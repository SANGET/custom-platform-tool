/*
 * @Author: your name
 * @Date: 2020-08-03 12:22:24
 * @LastEditTime: 2020-08-03 12:25:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\DataManager\src\store\index.ts
 */
import { createStore } from 'redux';
import reducer from '../reducers';

export interface IState {
  lastUpdated: number;
  todos: string[];
}

export type Action =
  | {
    type: 'add todo';
    todo: string;
  }
  | {
    type: 'delete todo';
    index: number;
  };

export function makeStore() {
  return createStore(reducer, {
    lastUpdated: 0,
    todos: [
      'Make the fire!',
      'Fix the breakfast!',
      'Wash the dishes!',
      'Do the mopping!',
    ],
  });
}
