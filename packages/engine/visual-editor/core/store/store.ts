import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import AppReducers, { VisualEditorState } from '../reducers';

const storeCache: {
  [storeID: string]: VisualEditorState
} = {};

export const getStore = (storeID: string) => {
  return storeCache[storeID];
};

const logger = createLogger({
  // ...options
});

/**
 * 用于存储多个 store
 * @param storeID store ID
 * @param preloadedState
 */
export default function createChatStore(
  /** 用于存储多个 store */
  storeID: string,
  preloadedState?: VisualEditorState,
) {
  let _store = storeCache[storeID];
  if (!_store) {
    _store = createStore(
      AppReducers,
      preloadedState,
      applyMiddleware(
        // logger
      )
    );
    // window[`$${storeID}`] = _store;
    storeCache[storeID] = _store;
  }

  return _store;
}
