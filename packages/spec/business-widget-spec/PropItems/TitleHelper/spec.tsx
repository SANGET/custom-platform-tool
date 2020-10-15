import React from 'react';
import { Input, Selector } from '@infra/ui';
import { PropItemCompAccessSpec } from '@engine/visual-editor/data-structure';

export const TitleHelperSpec: PropItemCompAccessSpec = () => ({
  id: 'prop_title_value',

  label: '标题',

  whichAttr: 'title',

  defaultValue: '输入框标题',

  render(ctx) {
    const { changeEntityState, widgetEntityState } = ctx;
    /** 取自身定义的 whichAttr */
    let value = widgetEntityState.title;
    if (value === null) value = '';
    return (
      <div>
        <Input value={value} onChange={changeEntityState} />
      </div>
    );
  }
});
