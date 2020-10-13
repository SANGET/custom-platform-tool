import React from 'react';
import { PropItemCompAccessSpec } from '@engine/visual-editor/data-structure';

export const ColumnHelperSpec: PropItemCompAccessSpec = () => ({
  id: 'prop_flex_config',

  label: '列数量',

  whichAttr: 'columnCount',

  propItemCompDef: {
    type: 'FieldSelector',
  },

  config: {
    type: 'DropdownSelector',
    defaultValue: 1,
    values: [{
      text: 1,
      value: 1
    }, {
      text: 2,
      value: 2
    }, {
      text: 3,
      value: 3
    }, {
      text: 4,
      value: 4
    }]
  },

  render() {
    return (
      <div></div>
    );
  }
});
