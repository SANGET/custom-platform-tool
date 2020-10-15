import React from 'react';
import { PropItemCompAccessSpec } from '@engine/visual-editor/data-structure';

export const FieldHelperSpec: PropItemCompAccessSpec = () => ({
  id: 'prop_field',

  label: '列',

  whichAttr: ['field'],

  propItemCompDef: {
    type: 'FieldSelector',
  },

  render() {
    return (
      <div>绑定字段</div>
    );
  }
});
