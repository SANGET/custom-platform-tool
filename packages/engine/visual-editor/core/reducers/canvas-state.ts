import { ComponentElement } from "@iub-dsl/core/types/component";

import { SELECT_ENTITY } from "../actions/canvas";
import { LayoutContentElement } from "../layout-content";

export interface layoutContentState {
  content: LayoutContentElement[]
}
export const layoutContent = (
  state: layoutContentState = {
    content: []
  },
  action
) => {
  switch (action.type) {
    case SELECT_ENTITY:
      switch (action.entity.type) {
        case "component":
          state.content = [...state.content, action.entity];
          break;
        case "container":

          break;
      }
      return state;
    default:
      return state;
  }
};

export interface componentsCollectionState {
  componentsCollection: {
    [componentID: string]: ComponentElement;
  };
}
export const componentsCollection = (
  state: componentsCollectionState = {},
  action
) => {
  switch (action.type) {
    case SELECT_ENTITY:
      switch (action.entity.type) {
        case "component":

          break;
      }
      return action.entity;
    default:
      return state;
  }
};
