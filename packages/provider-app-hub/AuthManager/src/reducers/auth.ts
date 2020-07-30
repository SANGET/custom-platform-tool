/*
 * @Author: your name
 * @Date: 2020-07-29 14:10:52
 * @LastEditTime: 2020-07-30 09:26:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\AuthManager\src\reducers\auth.js
 */
/** 模拟数据 */
import { treeData } from '../mock';

type StateType = {
  isShowLoading: boolean,
  dataSource:treeData
}

type ActionType = {
  type: 'hide' | 'show' | 'dataSource' | 'selectedTree',
  payload?:unknown
}

export const defaultState = {
  isShowLoading: false,
  dataSource: treeData,
};

export const loadingReducer = (state, action:ActionType) => {
  switch (action.type) {
    case ('hide'):
      return {
        ...state,
        isShowLoading: false
      };
    case ('show'):
      return {
        ...state,
        isShowLoading: true
      };
    case ('dataSource'):
      return {
        ...state,
        dataSource: action.payload
      };
    case ('selectedTree'):
      return {
        ...state,
        selectedTree: action.payload
      };
    default:
      return state;
  }
};
