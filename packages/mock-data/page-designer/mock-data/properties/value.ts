import { PropItemConfig } from "@engine/visual-editor/data-structure";

const PropValue: PropItemConfig = (entity) => {
  return {
    id: 'prop_real_value',
    label: '值',
    type: 'value',
    useFx: true,
    propItemCompDef: {
      type: 'Input',
    }
  };
};

export default PropValue;
