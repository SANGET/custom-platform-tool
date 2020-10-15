import React from 'react';
import { Input, Selector } from '@infra/ui';
import { PropItemCompAccessSpec } from '@engine/visual-editor/data-structure';

export const TitleColorHelperSpec: PropItemCompAccessSpec = () => ({
  id: 'title_color_helper',

  label: '标题颜色',

  whichAttr: 'labelColor',

  render: (ctx) => {
    const { changeEntityState, widgetEntityState } = ctx;
    /** 取自身定义的 whichAttr */
    let value = widgetEntityState.labelColor;
    if (value === null) value = '';
    return (
      <div>
        <Input value={value} onChange={changeEntityState} />
      </div>
    );
  }
});
