import React from 'react';
import { PropItemRendererProps } from '@engine/visual-editor/components/PropertiesEditor/types';
import * as PropItemComps from '@infra/ui/form';
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
    label, propItemCompDef, propItemCompRender,
  } = propItemConfig;

  let Com;
  if (propItemCompRender) {
    Com = propItemCompRender({
      onChange,
      InterComp: PropItemComps,
      fxHelper: FXContainer
    });
  } else if (propItemCompDef) {
    const { type: propItemCompType, ...propsForComponent } = propItemCompDef;
    const propItemCompConfig = getPropItem(propItemCompType);
    if (propItemCompConfig.unexpected) {
      Com = <Unexpect />;
    } else {
      Com = propItemCompConfig.render(propItemValue, onChange);
    }
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
