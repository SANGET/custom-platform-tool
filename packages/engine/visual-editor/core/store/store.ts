import { createStore, applyMiddleware } from 'redux';

import AppReducers, { VisualEditorState } from '../reducers';

let store: VisualEditorState | null;

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
