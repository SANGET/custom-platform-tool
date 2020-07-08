import { createStore, applyMiddleware } from 'redux';

import AppReducers from '../reducers';
import { layoutContentState } from '../reducers/canvas-state';

export interface VisualEditorStore {
  layoutContentState: layoutContentState
}

let store: VisualEditorStore | null;

export const getStore = () => {
  return store;
};

export const disposeStore = () => {
  store = null;
};

export default function createChatStore(preloadedState?) {
  if (!store) {
    store = createStore<VisualEditorStore>(
      AppReducers,
      preloadedState,
      applyMiddleware(
      )
    );
  }

  return store;
}
