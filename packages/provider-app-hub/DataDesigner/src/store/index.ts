/*
 * @Author: your name
 * @Date: 2020-08-03 12:22:24
 * @LastEditTime: 2020-08-13 16:05:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\DataManager\src\store\index.ts
 */

import { createStore } from 'redux';

/**
* 导入reducer
*/
import reducer from '@provider-app/data-designer/src/store/reducers';
/**
* 导入初始状态
*/
import { defaultState } from '@provider-app/data-designer/src/store/initState';

/**
* 持久化store和reducer
* 数据将会保存在localStorage中
*/
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

/**
* 持久化存储redux state配置
*/
const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2
};
const myPersistReducer = persistReducer(persistConfig, reducer);
const store = createStore(myPersistReducer, defaultState);
export const persistor = persistStore(store);
export default store;
