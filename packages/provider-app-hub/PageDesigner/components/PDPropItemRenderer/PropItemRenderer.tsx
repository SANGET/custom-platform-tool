import React from 'react';
import { PropItemRendererProps } from '@engine/visual-editor/components/PropertiesEditor/types';
import { PropItemRenderContext } from '@engine/visual-editor/data-structure';
import { Unexpect } from '../WidgetRenderer';

interface PDPropItemRendererProps extends PropItemRendererProps {
  interDatasources
  pageMetadata
}

/**
 * 属性项渲染器
 * 根据属性项的 type 选择对应的组件进行渲染
 */
export const PropItemRenderer: React.FC<PDPropItemRendererProps> = ({
  interDatasources,
  propItemMeta,
  propItemValue,
  pageMetadata,
  changeEntityState,
  ChangeMetadata,
  ...other
}) => {
  const propItemRenderCtx: PropItemRenderContext = {
    takeMeta: (options) => {
      const { metaAttr, metaRefID } = options;
      return metaRefID ? pageMetadata[metaAttr]?.[metaRefID] : pageMetadata[metaAttr];
    },
    genMetaRefID: (metaAttr) => {
      if (!metaAttr) throw Error('请传入 metaAttr，否则逻辑无法进行');
      const meta = pageMetadata[metaAttr];
      const metaID = meta ? String(Object.keys(pageMetadata[metaAttr]).length + 1) : '1';
      const prefix = metaAttr;
      return `${prefix}_${metaID}`;
    },
    changePageMeta: ChangeMetadata,
    interDatasources,
    changeEntityState,
    widgetEntityState: propItemValue,
  };

  const {
    label,
  } = propItemMeta;

  // const propItemCompConfig = getPropItem(propItemCompType);

  let Com;
  if (!propItemMeta.render) {
    Com = <Unexpect />;
  } else {
    Com = propItemMeta.render(propItemRenderCtx);
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
