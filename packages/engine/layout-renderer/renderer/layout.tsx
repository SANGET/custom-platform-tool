import React from 'react';
import { LayoutNodeInfo } from '../types';

/**
 * Wrapper 的上下文
 */
export interface LayoutWrapperContext {
  id: string
  idx: number
  node: LayoutNodeInfo
  children?: JSX.Element
}

export interface LayoutParserWrapper {
  /** 容器渲染 wrapper 包装函数 */
  containerWrapper?: (ctx: LayoutWrapperContext) => React.ReactChild
  /** 组件渲染器，由调用方实现 */
  componentRenderer?: (ctx: LayoutWrapperContext) => React.ReactChild
}

export interface LayoutRendererProps extends LayoutParserWrapper {
  layoutNode: LayoutNodeInfo[];
}

/**
 * TODO: 完善布局
 */
// const containerLayoutParser = (layoutInfo): React.CSSProperties => {
//   return {
//     display: 'flex'
//   };
// };

/**
 * 布局渲染器
 *
 * TODO: 结果缓存，优化性能
 *
 * parserContext 将传入每一个 parser
 */
const renderLayout = (
  layoutNode: LayoutNodeInfo[],
  wrapper: LayoutParserWrapper,
) => {
  return Array.isArray(layoutNode) && layoutNode.map((node, idx) => {
    const { id } = node;
    const { containerWrapper, componentRenderer } = wrapper;
    const wrapperContext: LayoutWrapperContext = { id, idx, node };
    switch (node.type) {
      case 'container':
        // const { layout } = node;
        // TODO: 加入布局UI隔离
        const childOfContainer = renderLayout(node.body, wrapper);
        // const childOfContainer = (
        //   <div
        //     style={containerLayoutParser(layout)}
        //     className="container"
        //     key={id + idx}
        //   >
        //     {
        //       renderLayout(node.body, wrapper)
        //     }
        //   </div>
        // );
        wrapperContext.children = childOfContainer;

        return typeof containerWrapper === 'function'
          ? containerWrapper(wrapperContext)
          : childOfContainer;
      case 'component':
        return componentRenderer && componentRenderer(wrapperContext);
    }
  });
};

const LayoutRenderer: React.FC<LayoutRendererProps> = (
  props,
) => {
  const {
    layoutNode,
    containerWrapper,
    componentRenderer,
  } = props;
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

export { LayoutRenderer };
