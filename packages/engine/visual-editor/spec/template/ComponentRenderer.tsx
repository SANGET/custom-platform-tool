import React from 'react';
import { EditorComponentEntity, EditorEntityState } from '@engine/visual-editor/types';
import ContainerWrapperCom from './ContainerWrapperCom';
import { getComp } from '../registerComp';

export interface ComponentTypeRendererProps {
  entity: EditorComponentEntity
  entityState: EditorEntityState
  node
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
export const ComponentRenderer: React.FC<ComponentTypeRendererProps> = (props) => {
  const {
    entity,
    entityState = {}
  } = props;
  const { component } = entity;
  const { label, style } = entityState;
  // console.log(entityState);

  let Com = <div></div>;
  if (!component) return Com;

  const { type, ...compProps } = component;
  switch (type) {
    case 'Input':
      const Input = getComp(type);
      Com = (
        <div className="__Input">
          <FormLabel>{label}</FormLabel>
          <Input
            {...compProps}
          />
        </div>
      );
      break;
    case 'Table':
      const EditableTable = getComp(type);
      Com = (
        <div className="__Table">
          <FormLabel>{label}</FormLabel>
          <EditableTable
            {...compProps}
          />
        </div>
      );
      break;
    case 'container':
      Com = (
        <ContainerWrapperCom {...props} />
      );
      break;
    default:
      break;
  }
  return (
    <div
      className="comp-renderer"
      style={style}
    >
      {Com}
    </div>
  );
};
