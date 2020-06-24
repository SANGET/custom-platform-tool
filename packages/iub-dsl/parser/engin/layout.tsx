import React from 'react';
import { LayoutContentGeneral, ElementType } from '@iub-dsl/core/types';

import componentParser from "./component-parser";
import { ParserBindActions } from '../types/parser-interface';

export interface LayoutParserParams extends ParserBindActions {
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
 */
const renderLayout = (layoutNode: ElementType[], bindActions: ParserBindActions) => {
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
              renderLayout(node.body, bindActions)
            }
          </div>
        );
      case 'componentRef':
        const componentConfig = bindActions.bindComponent(node.componentID);
        return (
          <div className="component" key={componentConfig?.id || 'none'}>
            {componentParser(componentConfig, bindActions)}
          </div>
        );
    }
  });
};

const layoutParser = ({
  layoutNode,
  ...bindActions
}: LayoutParserParams) => {
  return (
    <div>
      {
        renderLayout(layoutNode.content, bindActions)
      }
    </div>
  );
};

export default layoutParser;
