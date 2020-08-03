import React from 'react';
import redux from 'redux';
import { StoreContext } from 'redux-react-hook';

import { makeStore } from './Store';

const store = makeStore();

const App = () => {
  return <StoreContext.Provider value={store}>数据管理工具</StoreContext.Provider>;
};

export default App;
