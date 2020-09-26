import React from 'react';
import { WidgetEntity, WidgetEntityState } from '@engine/visual-editor/data-structure';
import classnames from 'classnames';
import { getCompEntity } from '../registerComp';

export interface ComponentTypeRendererProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  entity: WidgetEntity
  entityState: WidgetEntityState
}

const FormLabel = ({ children, className = '', ...props }) => (children ? (
  <div
    className="control-label form-title"
    {...props}
  >{children}</div>
) : null);

/**
 * 根据 component entity 解析的组件渲染器
 */
export const WidgetRenderer: React.FC<ComponentTypeRendererProps> = (props) => {
  const {
    entity,
    entityState = {},
    className,
    ...otherProps
  } = props;
  const { widgetDef } = entity;
  const { label, style } = entityState;

  const compContext = {
    entityState
  };
  // console.log(entityState);

  let Com = <div></div>;
  if (!widgetDef) return Com;

  const { type, ...compProps } = widgetDef;
  switch (type) {
    case 'Input':
      const { comp: Input } = getCompEntity(type);
      Com = (
        <div className="__Input">
          <FormLabel>{label}</FormLabel>
          <Input
            compContext={compContext}
            {...compProps}
          />
        </div>
      );
      break;
    case 'Table':
      const { comp: Table } = getCompEntity(type);
      Com = (
        <div className="__Table">
          <FormLabel>{label}</FormLabel>
          <Table
            compContext={compContext}
            {...compProps}
          />
        </div>
      );
      break;
    case 'container':
      Com = (
        <div>
          Container
        </div>
      );
      break;
    default:
      break;
  }
  const classes = classnames(
    "comp-renderer",
    className
  );
  return (
    <div
      {...otherProps}
      className={classes}
      style={style}
    >
      {Com}
    </div>
  );
};
