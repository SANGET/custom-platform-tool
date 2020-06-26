import React from 'react';
import { LayoutContentGeneral, ElementType } from '@iub-dsl/core/types';

import componentParser from "./component-parser";
import { ParserContextGroup } from '../types';

export interface LayoutParserParams {
  layoutNode: LayoutContentGeneral;
}

/**
 * TODO: 完善布局
 */
const containerLayoutParser = (layoutInfo): React.CSSProperties => {
  return {
    display: 'flex'
  };
};

/**
 * 布局渲染器
 *
 * parserContext 将传入每一个 parser
 */
const renderLayout = (layoutNode: ElementType[], parserContext: ParserContextGroup) => {
  return Array.isArray(layoutNode) && layoutNode.map((node, idx) => {
    switch (node.type) {
      case 'container':
        const { layout } = node;
        return (
          <div
            style={containerLayoutParser(layout)}
            className="container"
            key={idx}
          >
            {
              renderLayout(node.body, parserContext)
            }
          </div>
        );
      case 'componentRef':
        const componentConfig = parserContext.bindComponent(node.componentID);
        return (
          <div className="component" key={componentConfig?.id || 'none'}>
            {componentParser(componentConfig, parserContext)}
          </div>
        );
    }
  });
};

const layoutParser = (
  layoutParams: LayoutParserParams,
  parserContext: ParserContextGroup
) => {
  const {
    layoutNode,
  } = layoutParams;
  return (
    <div>
      {
        renderLayout(layoutNode.content, parserContext)
      }
    </div>
  );
};

export default layoutParser;
