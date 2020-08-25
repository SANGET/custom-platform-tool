import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import AppReducers, { VisualEditorState } from '../reducers';

let store: VisualEditorState | null;

export const getStore = () => {
  return store;
};

export const disposeStore = () => {
  store = null;
};

const logger = createLogger({
  // ...options
});

export default function createChatStore(
  preloadedState?: VisualEditorState
) {
  if (!store) {
    store = createStore(
      AppReducers,
      preloadedState,
      applyMiddleware(
        // logger
      )
    );
  }

  return store;
}
