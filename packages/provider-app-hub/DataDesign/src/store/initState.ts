/*
 * @Author: your name
 * @Date: 2020-08-03 12:22:24
 * @LastEditTime: 2020-08-06 10:21:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\DataManager\src\store\index.ts
 */
/** 分页类型 */
export interface IPager {
  page: number;
  pageSize: number;
}

/** 共享状态数据 */
export interface IState {
  /** 加载动画 */
  isShowLoading:boolean;
  /** 表结构分页对象 */
  structPager:IPager;
}

export const defaultState = {
  isShowLoading: false,
  structPager: {
    page: 1,
    pageSize: 10,
  },
};

/** 动作集合 */
export type Action =
  | {
    type: 'triggerStructPager'
    structPager: IPager;
  }
  | {
    type: 'triggerLoading'
    isShowLoading: boolean;
  };

// import { createStore } from 'redux';
// import reducer from '../reducers';

// export interface IPager {
//   page: number;
//   pageSize: number;
// }

// export type Action =
//   | {
//     type: 'triggerStructPager'
//     structPager: IPager;
//   };

// export function makeStore() {
//   return createStore(reducer, {
//     structPager: {
//       page: 1,
//       pageSize: 10,
//     },
//   });
// }
