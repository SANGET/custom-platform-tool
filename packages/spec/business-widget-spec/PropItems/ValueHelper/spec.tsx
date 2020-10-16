import React from 'react';
import { PropItemCompAccessSpec } from '@engine/visual-editor/data-structure';
import { ValueHelper } from './ValueHelper';

export const ValueHelperSpec: PropItemCompAccessSpec = (propItemCtx) => ({
  id: 'prop_real_value',

  label: '值',

  whichAttr: ['defValue', 'exp', 'variable'],

  render(ctx) {
    const { changeEntityState, widgetEntityState } = ctx;

    return (
      <ValueHelper
        onChange={changeEntityState}
        widgetEntityState={widgetEntityState}
      />
    );
  }
});
