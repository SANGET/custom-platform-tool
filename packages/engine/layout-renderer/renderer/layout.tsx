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
  containerWrapper?: (ctx: LayoutWrapperContext) => JSX.Element
  /** 组件渲染器，由调用方实现 */
  componentRenderer?: (ctx: LayoutWrapperContext) => JSX.Element
}

export interface LayoutRendererProps extends LayoutParserWrapper {
  layoutNode: LayoutNodeInfo[]
  RootRender?: (renderRes: React.ElementType[]) => JSX.Element
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
  const res: React.ElementType[] = [];
  if (Array.isArray(layoutNode)) {
    for (let i = 0; i < layoutNode.length; i++) {
      const node = layoutNode[i];

      const { id } = node;
      const { containerWrapper, componentRenderer } = wrapper;
      const wrapperContext: LayoutWrapperContext = { id, idx: i, node };
      switch (node.type) {
        case 'container':
          // const { layout } = node;
          // TODO: 加入布局UI隔离
          const childOfContainer = renderLayout(node.body, wrapper);
          let child;
          if (typeof containerWrapper === 'function') {
            wrapperContext.children = childOfContainer;
            child = containerWrapper(wrapperContext);
          } else {
            child = childOfContainer;
          }

          res.push(child);
          break;
        case 'component':
          res.push(componentRenderer && componentRenderer(wrapperContext));
          break;
      }
    }
  }
  return res;
};

/**
 * 布局渲染引擎入口
 */
const LayoutRenderer: React.FC<LayoutRendererProps> = (
  props,
) => {
  const {
    layoutNode,
    RootRender,
    containerWrapper,
    componentRenderer,
  } = props;
  const layoutRenderRes = renderLayout(layoutNode, {
    containerWrapper,
    componentRenderer,
  });
  return typeof RootRender === 'function' ? RootRender(layoutRenderRes) : (
    <div className="layout-parser-content">
      {
        layoutRenderRes
      }
    </div>
  );
};

export { LayoutRenderer };
