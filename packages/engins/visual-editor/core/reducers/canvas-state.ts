import { SELECT_ENTITY } from "../actions/canvas";

export const selectedEntity = (
  state = {},
  action
) => {
  switch (action.type) {
    case SELECT_ENTITY:
      return action.conctactEntity;
    default:
      return state;
  }
};
