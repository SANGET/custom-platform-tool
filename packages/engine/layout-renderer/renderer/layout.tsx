import React from 'react';
import { LayoutNodeInfo, ElemNestingInfo } from '../types';

/**
 * LayoutWrapper 上下文
 */
export interface LayoutWrapperContext {
  /** 组件 ID */
  id: string
  /** 组件 index */
  idx: number
  /** 组件嵌套信息 */
  nestingInfo: ElemNestingInfo
  /** 组件节点信息 */
  node: LayoutNodeInfo
  /** 组件的 children */
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
    let nestingDeep = 0;
    const nestingInfo: number[] = [];
    for (let i = 0; i < layoutNode.length; i++) {
      const node = layoutNode[i];
      nestingInfo[nestingDeep] = i;

      const { id } = node;
      const { componentRenderer } = wrapper;
      const wrapperContext: LayoutWrapperContext = {
        id, idx: i, node, nestingInfo
      };
      if (node.body) {
        const childOfContainer = renderLayout(node.body, wrapper);
        nestingDeep += 1;
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
