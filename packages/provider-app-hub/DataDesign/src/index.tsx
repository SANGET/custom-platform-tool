/**
 * 数据设计子应用入口
 */

import React from 'react';
import ReactDOM from 'react-dom';

import App from '@data-design/app';
/** 因为app.tsx中也要用到state状态,所以要在app.tsx的上一层index.tsx中,创建仓库 */
/** 导出仓库上下文 */
import { StoreContext } from 'redux-react-hook';
import { makeStore } from '@data-design/store';
/** 创建仓库 */
const store = makeStore();
ReactDOM.render(
  <StoreContext.Provider value={store}>
    <App />
  </StoreContext.Provider>,
  document.querySelector('#root')
);
