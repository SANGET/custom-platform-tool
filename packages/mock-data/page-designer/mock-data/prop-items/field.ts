import { PropItemConfig } from "@engine/visual-editor/data-structure";

const PropField: PropItemConfig = (entity) => {
  return {
    id: 'prop_field',
    label: '列',
    type: 'field',
    propItemCompDef: {
      type: 'FieldSelector',
    }
  };
};

export default PropField;