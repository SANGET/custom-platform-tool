import React from 'react';
import { PropItemRendererProps } from '@engine/visual-editor/components/PropertiesEditor';
import { PropItemRenderContext } from '@engine/visual-editor/data-structure';
import { Unexpect } from '../WidgetRenderer';

interface PDPropItemRendererProps extends PropItemRendererProps {
  interDatasources: PD.Datasources
  pageMetadata
}

/**
 * 属性项渲染器
 * 根据属性项的 type 选择对应的组件进行渲染
 */
export const PropItemRenderer: React.FC<PDPropItemRendererProps> = ({
  propItemMeta,
  interDatasources,
  renderCtx
}) => {
  const {
    label,
  } = propItemMeta;

  let Com;
  if (!propItemMeta.render) {
    Com = <Unexpect />;
  } else {
    const propItemRenderContext = {
      ...renderCtx,
      businessPayload: {
        interDatasources
      }
    };
    Com = propItemMeta.render(propItemRenderContext);
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
