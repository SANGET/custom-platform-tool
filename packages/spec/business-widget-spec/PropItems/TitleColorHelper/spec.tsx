import React from 'react';
import { Input, Selector } from '@infra/ui';
import { PropItemCompAccessSpec } from '@engine/visual-editor/data-structure';

/** 属性项编辑的组件属性 */
const whichAttr = 'labelColor';

export const TitleColorHelperSpec: PropItemCompAccessSpec = {
  id: 'prop_style_title_color',

  label: '标题颜色',

  whichAttr,

  render: (ctx) => {
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
