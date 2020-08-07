/**
 * 数据设计子应用入口
 */
import React from 'react';
import ReactDOM from 'react-dom';

/** 数据设计子应用容器 */
import App from '@provider-app/data-design/src/app';

/** 导出数据仓库上下文 */
import { StoreContext } from 'redux-react-hook';
import { makeStore } from '@provider-app/data-design/src/store';
/** 创建数据仓库 */
const store = makeStore();
/** 因为App中也要用到state状态,所以要将数据仓库创建在App的上一层index.tsx中 */
ReactDOM.render(
  <StoreContext.Provider value={store}>
    <App />
  </StoreContext.Provider>,
  document.querySelector('#root')
);
