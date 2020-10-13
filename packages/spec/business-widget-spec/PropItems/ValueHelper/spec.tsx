import React from 'react';
import { PropItemCompAccessSpec } from '@engine/visual-editor/data-structure';
import { ValueHelper } from './ValueHelper';

export const ValueHelperSpec: PropItemCompAccessSpec = (propItemCtx) => ({
  id: 'prop_real_value',

  label: '值',

  whichAttr: 'defValue',

  render(ctx) {
    const { fxHelper, changeEntityState, widgetEntityState } = ctx;
    return (
      <ValueHelper
        fxHelper={fxHelper}
        onChange={changeEntityState}
        value={widgetEntityState}
      />
    );
  }
});
