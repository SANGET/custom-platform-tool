import React, { useEffect } from 'react';
import { Label } from '@deer-ui/core/label';
import { PropItemCompAccessSpec } from '@engine/visual-editor/data-structure';

const WidgetCodeComp = ({ ctx }) => {
  const { changeEntityState, editingWidgetState, widgetEntity } = ctx;
  // console.log('ctx :>> ', ctx);
  const { id } = widgetEntity;
  /** 取自身定义的 whichAttr */
  const _value = editingWidgetState[whichAttr];
  useEffect(() => {
    if (_value) return;
    changeEntityState({
      attr: whichAttr,
      value: id
    });
  }, []);
  return (
    <div>
      <Label>{_value}</Label>
    </div>
  );
};

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
    return <WidgetCodeComp ctx={ctx} />;
  }
};
