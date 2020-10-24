import React from 'react';
import { Input, Selector } from '@infra/ui';
import { PropItemCompAccessSpec } from '@engine/visual-editor/data-structure';

/** 属性项编辑的组件属性 */
const whichAttr = 'widgetCode';

/**
 * 组件的编码
 */
export const WidgetCodingHelperSpec: PropItemCompAccessSpec = {
  id: 'prop_widget_coding',

  label: '组件编码',

  whichAttr,

  render: (ctx) => {
    console.log('ctx :>> ', ctx);
    const { changeEntityState, widgetEntityState } = ctx;
    /** 取自身定义的 whichAttr */
    const _value = widgetEntityState[whichAttr];
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
