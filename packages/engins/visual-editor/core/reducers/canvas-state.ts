import { ComponentElement } from "@iub-dsl/core/types/component";

import { SELECT_ENTITY } from "../actions/canvas";
import { LayoutContentElement } from "../layout-content";

export interface layoutContentState {
  content: LayoutContentElement[]
}
export const layoutContent = (
  state: layoutContentState = {},
  action
) => {
  switch (action.type) {
    case SELECT_ENTITY:
      console.log(action);
      switch (action.entity.type) {
        case "component":

          break;
        case "container":

          break;
      }
      return action.entity;
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
      console.log(action);
      switch (action.entity.type) {
        case "component":

          break;
      }
      return action.entity;
    default:
      return state;
  }
};
