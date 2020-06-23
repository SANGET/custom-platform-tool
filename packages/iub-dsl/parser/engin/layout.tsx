import React from 'react';
import { LayoutContentGeneral, ElementType } from '@iub-dsl/core/types';
import { ComponentElement } from '@iub-dsl/core/types/component/collection';
import { ActionFlow } from '@iub-dsl/core/types/actions/action-collection';

import componentParser from "./component-parser";

interface LayoutBindActions {
  bindAction: (actionID: string) => ActionFlow;
  bindComponent: (componentID: string) => ComponentElement;
  authUI: Function;
}

export interface LayoutParserParams extends LayoutBindActions {
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
const renderLayout = (layoutNode: ElementType[], bindActions: LayoutBindActions) => {
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
            {componentParser(componentConfig)}
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
