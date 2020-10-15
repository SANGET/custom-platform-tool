import React from 'react';
import { PropItemCompAccessSpec } from '@engine/visual-editor/data-structure';
import { ValueHelper } from './ValueHelper';

export const ValueHelperSpec: PropItemCompAccessSpec = (propItemCtx) => ({
  id: 'prop_real_value',

  label: '值',

  whichAttr: ['defValue', 'exp', 'variable'],

  render(ctx) {
    const { fxHelper, changeEntityState, widgetEntityState } = ctx;
    console.log(widgetEntityState);

    /** 取自身定义的 whichAttr */
    let value = widgetEntityState.defValue;
    if (value === null) value = '';
    return (
      <ValueHelper
        fxHelper={fxHelper}
        onChange={changeEntityState}
        value={value}
      />
    );
  }
});
