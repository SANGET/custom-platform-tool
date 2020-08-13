/**
 * 数据设计子应用入口
 */
import React from 'react';
import ReactDOM from 'react-dom';

/**
 * 数据设计子应用容器
 */
import App from '@provider-app/data-designer/src/app';

/**
 * 导出数据仓库上下文
 */
import { StoreContext } from 'redux-react-hook';
/**
* redux数据持久化相关
*/
import store, { persistor } from '@provider-app/data-designer/src/store';
import { PersistGate } from 'redux-persist/lib/integration/react';
/**
 * 创建数据仓库
 * */
// const store = makeStore();
/**
 * 因为App中也要用到state状态,所以要将数据仓库创建在App的上一层index.tsx中
 */
ReactDOM.render(
  /** 设置store全局上下文 */
  <StoreContext.Provider value={store}>
    <PersistGate persistor={persistor}>
      {/* 主应用 */}
      <App />
    </PersistGate>
  </StoreContext.Provider>,
  document.querySelector('#root')
);
