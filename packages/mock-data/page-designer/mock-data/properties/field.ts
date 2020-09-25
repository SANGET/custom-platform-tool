import { PropertyItemConfigFunc } from "@engine/visual-editor/data-structure";

const PropField: PropertyItemConfigFunc = (entity) => {
  return {
    id: 'prop_field',
    label: '列',
    type: 'field',
    component: {
      type: 'FieldSelector',
    }
  };
};

export default PropField;
