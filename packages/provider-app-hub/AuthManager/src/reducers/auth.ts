/*
 * @Author: your name
 * @Date: 2020-07-29 14:10:52
 * @LastEditTime: 2020-07-29 15:05:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\AuthManager\src\reducers\auth.js
 */

type StateType = {
  isShowLoading: boolean
}

type ActionType = {
  type: 'hide' | 'show' | 'increment'
}

export const defaultState = { isShowLoading: false };

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
    default:
      return state;
  }
};
