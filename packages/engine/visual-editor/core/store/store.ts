import { createStore, applyMiddleware } from 'redux';

import AppReducers, { VisualEditorState } from '../reducers';
import { layoutContentState } from '../reducers/canvas-state';

export interface VisualEditorStore extends VisualEditorState {
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
    store = createStore(
      AppReducers,
      preloadedState,
      applyMiddleware(
      )
    );
  }

  return store;
}
