import React from 'react';
import classnames from 'classnames';
import { WidgetRendererProps } from '@engine/visual-editor/spec';
import { Unexpect } from './Unexpect';
// import ContainerWrapperCom from './ContainerWrapperCom';

export interface PDWidgetRendererProps extends WidgetRendererProps {
  className?
}

/**
 * 根据 widget entity 解析的组件渲染器
 */
export const WidgetRenderer: React.FC<PDWidgetRendererProps> = (props) => {
  const {
    entity,
    entityState = {},
    layoutNodeItem,
    className,
    onClick,
    nestingInfo,
    businessWidgetConfig,
    ...otherProps
  } = props;
  const { widgetDef } = entity;
  const { render: bizWidgetRender } = businessWidgetConfig || {};

  const compContext = {
    entityState
  };
  // console.log(entityState);

  let Com = <div></div>;
  if (!widgetDef) return Com;

  const { type, ...restWidgetProps } = widgetDef;
  const widgetProps = Object.assign({}, restWidgetProps, entityState);
  /**
   * 如果需要特殊处理，则在此做
   */
  switch (type) {
    default:
      Com = bizWidgetRender ? bizWidgetRender(widgetProps) : <Unexpect />;
      // const RendererComp = comp;
      // Com = RendererComp ? (
      //   <RendererComp
      //     compContext={compContext}
      //     {...entityState}
      //     {...widgetProps}
      //   />
      // ) : <Unexpect />;
      break;
  }
  const classes = classnames(
    "comp-renderer",
    className
  );
  return (
    <div
      {...otherProps}
      onClick={onClick}
      className={classes}
    >
      {Com}
      <div className="__mark"></div>
    </div>
  );
};
