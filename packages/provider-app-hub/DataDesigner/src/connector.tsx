/*
 * @Author: your name
 * @Date: 2020-08-19 17:25:29
 * @LastEditTime: 2020-08-22 14:51:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\DataDesigner\src\tools\connector.ts
 */

import React, { useEffect } from 'react';

/**
 * 全局样式入口
 */
import '@provider-app/data-designer/src/styles/index.less';
/**
 * 导出数据仓库上下文
 */
import { StoreContext } from 'redux-react-hook';
/**
* redux数据持久化相关
*/
import store, { persistor } from '@provider-app/data-designer/src/store';
import { PersistGate } from 'redux-persist/lib/integration/react';

export const Connector = (App) => () => {
  useEffect(() => {
    // console.log();
    return () => {
      // console.log('页面销毁');
      /**
      * 清空本地的localStorage
      */
      // localStorage.clear();
    };
  }, []);
  return (
    <StoreContext.Provider value={store}>
      <PersistGate persistor={persistor}>
        {/* 主应用 */}
        <div className="data-designer"><App /></div>
      </PersistGate>
    </StoreContext.Provider>
  );
};
