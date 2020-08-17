import { combineReducers } from "redux";

import {
  entitiesStateStoreReducer,
  selectedEntitiesReducer,
  // getEntityDefaultState,
} from './canvas-state';

/**
 * 将 reducer 合成
 */
const VisualEditorStateReducer = combineReducers({
  entitiesStateStore: entitiesStateStoreReducer,
  selectedEntities: selectedEntitiesReducer,
});

export default VisualEditorStateReducer;

export type VisualEditorState = ReturnType<typeof VisualEditorStateReducer>
