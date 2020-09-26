import React from 'react';
import { LayoutNodeItem, ElemNestingInfo } from '../types';

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
  layoutNodeItem: LayoutNodeItem
  /** 组件的 children */
  children?: React.ElementType[]
}

export interface LayoutParserWrapper {
  /** 组件渲染器，由调用方实现 */
  componentRenderer?: (ctx: LayoutWrapperContext) => JSX.Element
}

export interface LayoutRendererProps extends LayoutParserWrapper {
  layoutNode: LayoutNodeItem[]
  RootRender?: (renderRes: React.ElementType[]) => JSX.Element
}

const Elem = ({
  id, children
}) => {
  return (
    <div id={id}>{children}</div>
  );
};

/**
 * 布局渲染器
 */
const renderLayout = (
  layoutNode: LayoutNodeItem[],
  wrapper: LayoutParserWrapper,
) => {
  const res: React.ElementType[] = [];
  if (Array.isArray(layoutNode)) {
    let nestingDeep = 0;
    const nestingInfo: number[] = [];
    for (let i = 0; i < layoutNode.length; i++) {
      const layoutNodeItem = layoutNode[i];
      nestingInfo[nestingDeep] = i;

      const { id } = layoutNodeItem;
      const { componentRenderer } = wrapper;
      const wrapperContext: LayoutWrapperContext = {
        id, idx: i, layoutNodeItem, nestingInfo
      };
      if (layoutNodeItem.body) {
        const childOfContainer = renderLayout(layoutNodeItem.body, wrapper);
        nestingDeep += 1;
        let child;
        if (typeof componentRenderer === 'function') {
          wrapperContext.children = childOfContainer;
          child = componentRenderer(wrapperContext);
        } else {
          child = childOfContainer;
        }

        res.push(child);
        // res.push(<Elem id={id} key={id}>{child}</Elem>);
      } else {
        const child: any = componentRenderer && componentRenderer(wrapperContext);
        res.push(child);
      }
    }
  }
  return res;
};

/**
 * 布局渲染器
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
