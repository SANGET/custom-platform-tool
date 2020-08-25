import { combineReducers } from "redux";

import {
  // entitiesStateStoreReducer,
  selectedEntitiesReducer,
  // getEntityDefaultState,
} from './canvas-state';
import { pageMetadataReducer, appContextReducer } from './page-state';
import { layoutInfoReducer } from "./layout-info";

/**
 * 将 reducer 合成
 */
const VisualEditorStateReducer = combineReducers({
  // entitiesStateStore: entitiesStateStoreReducer,
  selectedEntities: selectedEntitiesReducer,
  layoutInfo: layoutInfoReducer,
  pageMetadata: pageMetadataReducer,
  appContext: appContextReducer,
});

export default VisualEditorStateReducer;

export type VisualEditorState = ReturnType<typeof VisualEditorStateReducer>
