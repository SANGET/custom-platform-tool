import { combineReducers } from "redux";

import {
  selectedEntity,
} from './canvas-state';

const Reducers = combineReducers({
  selectedEntity,
});

export default Reducers;
