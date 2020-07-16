import React from 'react';
import { LayoutContentElement } from '@iub-dsl/core';

interface WrapperContext {
  id: string
  idx: number
}

export interface LayoutParserWrapper {
  /** 容器渲染 wrapper 包装函数 */
  containerWrapper?: (child: React.ReactChild, wp: WrapperContext) => React.ReactChild
  /** 组件渲染器，由调用方实现 */
  componentRenderer?: (node, wp: WrapperContext) => React.ReactChild
}

export interface LayoutParserParams extends LayoutParserWrapper {
  layoutNode: LayoutContentElement[];
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
 * TODO: 结果缓存，优化性能
 *
 * parserContext 将传入每一个 parser
 */
const renderLayout = (
  layoutNode: LayoutContentElement[],
  wrapper: LayoutParserWrapper,
) => {
  return Array.isArray(layoutNode) && layoutNode.map((node, idx) => {
    const { id } = node;
    const { containerWrapper, componentRenderer } = wrapper;
    const wrapperContext = { id, idx };
    switch (node.type) {
      case 'container':
        const { layout } = node;
        // TODO: 加入布局UI隔离
        const childOfContainer = (
          <div
            style={containerLayoutParser(layout)}
            className="container"
            key={id + idx}
          >
            {
              renderLayout(node.body, wrapper)
            }
          </div>
        );

        return typeof containerWrapper === 'function'
          ? containerWrapper(childOfContainer, wrapperContext)
          : childOfContainer;
      case 'component':
        return componentRenderer && componentRenderer(node, wrapperContext);
        // const componentConfig = parserContext.bindComponent(node.componentID);
        // // TODO: 套这一层应该，放在布局容器，用其他方式解耦
        // const childOfComponent = (
        //   <div className="component" key={id + idx || 'none'}>
        //     {componentParser(componentConfig, parserContext)}
        //   </div>
        // );
        // return typeof componentRenderer === 'function'
        //   ? componentRenderer(childOfComponent, { id, idx, componentConfig })
        //   : childOfComponent;
    }
  });
};

const LayoutRenderer = (
  layoutParams: LayoutParserParams,
) => {
  const {
    layoutNode,
    containerWrapper,
    componentRenderer,
  } = layoutParams;
  return (
    <div className="layout-parser-content">
      {
        renderLayout(layoutNode, {
          containerWrapper,
          componentRenderer,
        })
      }
    </div>
  );
};

export default LayoutRenderer;
