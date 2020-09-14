import React from 'react';
import classnames from 'classnames';
import { getCompEntity, FacToComponentProps, RegisterComponentConfig } from '@engine/visual-editor/spec';
// import ContainerWrapperCom from './ContainerWrapperCom';

export interface ComponentTypeRendererProps extends FacToComponentProps {
  className?
  registeredEntity: RegisterComponentConfig
}

const FormLabel = ({
  children,
  className = '',
  ...props
}) => (children ? (
  <div
    className="control-label form-title"
    {...props}
  >
    {children}
  </div>
) : null);

/**
 * 根据 component entity 解析的组件渲染器
 */
export const ComponentRenderer: React.FC<ComponentTypeRendererProps> = (props) => {
  const {
    entity,
    entityState = {},
    node,
    className,
    onClick,
    nestingInfo,
    registeredEntity,
    ...otherProps
  } = props;
  const { component } = entity;
  const { title, labelColor, value } = entityState;
  const { comp } = registeredEntity;

  const compContext = {
    entityState
  };
  // console.log(entityState);

  let Com = <div></div>;
  if (!component) return Com;

  const { type, ...compProps } = component;
  switch (type) {
    case 'Input':
      const Input = comp;
      Com = (
        <div className="__Input">
          <FormLabel
            style={{
              color: labelColor
            }}
          >
            {title}
          </FormLabel>
          <Input
            compContext={compContext}
            value={value || ''}
            {...compProps}
          />
        </div>
      );
      break;
    case 'Table':
      const Table = comp;
      Com = (
        <div className="__Table">
          <FormLabel>{title}</FormLabel>
          <Table
            compContext={compContext}
            {...compProps}
          />
        </div>
      );
      break;
    case 'container':
      Com = (
        // <ContainerWrapperCom {...props} />
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
      onClick={onClick}
      className={classes}
    >
      {Com}
      <div className="__mark"></div>
    </div>
  );
};
