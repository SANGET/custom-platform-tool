import React from 'react';
import { LayoutNodeInfo } from '../types';

/**
 * LayoutWrapper 上下文
 */
export interface LayoutWrapperContext {
  id: string
  idx: number
  node: LayoutNodeInfo
  children?: React.ElementType[]
}

export interface LayoutParserWrapper {
  /** 组件渲染器，由调用方实现 */
  componentRenderer?: (ctx: LayoutWrapperContext) => JSX.Element
}

export interface LayoutRendererProps extends LayoutParserWrapper {
  layoutNode: LayoutNodeInfo[]
  RootRender?: (renderRes: React.ElementType[]) => JSX.Element
}

/**
 * 布局渲染器
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
      const { componentRenderer } = wrapper;
      const wrapperContext: LayoutWrapperContext = { id, idx: i, node };
      if (node.body) {
        const childOfContainer = renderLayout(node.body, wrapper);
        let child;
        if (typeof componentRenderer === 'function') {
          wrapperContext.children = childOfContainer;
          child = componentRenderer(wrapperContext);
        } else {
          child = childOfContainer;
        }

        res.push(child);
      } else {
        const child: any = componentRenderer && componentRenderer(wrapperContext);
        res.push(child);
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
    componentRenderer,
  } = props;
  const layoutRenderRes = renderLayout(layoutNode, {
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
