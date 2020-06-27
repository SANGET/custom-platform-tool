import { createStore, applyMiddleware } from 'redux';

import AppReducers from '../reducers';

let store;

export const getStore = () => {
  return store;
};

export const disposeStore = () => {
  store = null;
};

export default function createChatStore(preloadedState?) {
  if (!store) {
    store = createStore(
      AppReducers,
      preloadedState,
      applyMiddleware(
      )
    );
  }

  return store;
}
