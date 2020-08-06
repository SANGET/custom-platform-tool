/*
 * @Author: your name
 * @Date: 2020-08-03 12:22:24
 * @LastEditTime: 2020-08-06 10:25:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\DataManager\src\store\index.ts
 */

import { createStore } from 'redux';
/** 导入reducer */
import reducer from '@data-design/store/reducers';
import { defaultState } from '@data-design/store/initState';

/**
 * 创建数据仓库
 */
export function makeStore() {
  return createStore(reducer, defaultState);
}
