import React from 'react';
import { Input, Selector } from '@infra/ui';
import { PropItemCompAccessSpec } from '@engine/visual-editor/data-structure';

/** 属性项编辑的组件属性 */
const whichAttr = 'title';

export const TitleHelperSpec: PropItemCompAccessSpec = {
  id: 'prop_title_value',

  label: '标题',

  whichAttr,

  defaultValues: {
    [whichAttr]: '标题'
  },

  render(ctx) {
    const { changeEntityState, editingWidgetState } = ctx;
    /** 取自身定义的 whichAttr */
    const _value = editingWidgetState[whichAttr];
    return (
      <div>
        <Input
          value={_value || ''}
          onChange={(value) => changeEntityState({
            attr: whichAttr,
            value
          })}
        />
      </div>
    );
  }
};
