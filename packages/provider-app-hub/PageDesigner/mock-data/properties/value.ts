import { PropertyItemConfigFunc } from "@engine/visual-editor/types";

const PropValue: PropertyItemConfigFunc = (entity) => {
  return {
    id: 'prop-value',
    label: '值',
    type: 'general',
    target: 'value',
    fx: true,
    component: {
      type: 'Input',
    }
  };
};

export default PropValue;
