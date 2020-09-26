import React from 'react';
import { PropItemRendererProps } from '@engine/visual-editor/components/PropertiesEditor/types';
import { getPropItem } from '@spec/business-widget';
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
  const {
    label, propItemCompDef, useFx,
  } = propItemConfig;
  const { type: propItemCompType, ...propsForComponent } = propItemCompDef;

  let Com;
  const propItemCompConfig = getPropItem(propItemCompType);
  if (propItemCompConfig.unexpected) {
    // 处理异常组件
    Com = <Unexpect />;
  } else {
    Com = propItemCompConfig.render(propItemValue, onChange);
  }
  const fxComp = useFx && (
    <FXContainer
      onChange={(val) => {
        // TODO: 完善 useFx
        console.log('useFx change:', val);
      }}
    />
  );
  return (
    <div className="mb10">
      <div className="label mb5">{label}</div>
      <div className="content">
        {Com}
        {fxComp}
      </div>
    </div>
  );
};
