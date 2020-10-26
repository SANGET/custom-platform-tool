import React from 'react';
import { PropItemCompAccessSpec } from '@engine/visual-editor/data-structure';
import { ValueHelper } from './comp';

export const ValueHelperSpec: PropItemCompAccessSpec = {
  id: 'prop_real_value',

  label: '值',

  whichAttr: ['defValue', 'exp', 'variable'],

  render(ctx) {
    const { changeEntityState, editingWidgetState } = ctx;

    return (
      <ValueHelper
        onChange={changeEntityState}
        editingWidgetState={editingWidgetState}
      />
    );
  }
};
