import React from 'react';
import { PropItemRendererProps } from '@engine/visual-editor/components/PropertiesEditor/types';
import { FXContainer } from './FXContainer';
import { Unexpect } from '../WidgetRenderer';

/**
 * 属性项渲染器
 * 根据属性项的 type 选择对应的组件进行渲染
 */
export const PropItemRenderer: React.FC<PropItemRendererProps> = ({
  propItemConfig,
  propItemValue,
  onChange,
}) => {
  const propItemRenderCtx = {
    changeEntityState: onChange,
    widgetEntityState: propItemValue,
  };

  const {
    label, propItemCompDef,
  } = propItemConfig;

  // const propItemCompConfig = getPropItem(propItemCompType);

  let Com;
  // const { type: propItemCompType, ...propsForComponent } = propItemCompDef;
  if (!propItemConfig.render) {
    Com = <Unexpect />;
  } else {
    Com = propItemConfig.render(propItemRenderCtx);
  }
  return (
    <div className="mb10">
      <div className="label mb5">{label}</div>
      <div className="content">
        {Com}
      </div>
    </div>
  );
};
