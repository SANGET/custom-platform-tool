import React from 'react';
import classnames from 'classnames';
import { FacToComponentProps, RegisterComponentConfig } from '@engine/visual-editor/spec';
import { Unexpect } from './Unexpect';
// import ContainerWrapperCom from './ContainerWrapperCom';

export interface ComponentTypeRendererProps extends FacToComponentProps {
  className?
  registeredEntity?: RegisterComponentConfig
}

/**
 * 根据 widget entity 解析的组件渲染器
 */
export const ComponentRenderer: React.FC<ComponentTypeRendererProps> = (props) => {
  const {
    entity,
    entityState = {},
    layoutNodeItem,
    className,
    onClick,
    nestingInfo,
    registeredEntity,
    ...otherProps
  } = props;
  const { widgetDef } = entity;
  const { comp } = registeredEntity || {};

  const compContext = {
    entityState
  };
  // console.log(entityState);

  let Com = <div></div>;
  if (!widgetDef) return Com;

  const { type, ...compProps } = widgetDef;
  /**
   * 如果需要特殊处理，则在此做
   */
  switch (type) {
    default:
      const RendererComp = comp;
      Com = RendererComp ? (
        <RendererComp
          compContext={compContext}
          {...entityState}
          {...compProps}
        />
      ) : <Unexpect />;
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
