import { PropertyItemConfigFunc } from "@engine/visual-editor/data-structure";

const PropValue: PropertyItemConfigFunc = (entity) => {
  return {
    id: 'prop_real_value',
    label: '值',
    type: 'value',
    fx: true,
    component: {
      type: 'Input',
    }
  };
};

export default PropValue;
