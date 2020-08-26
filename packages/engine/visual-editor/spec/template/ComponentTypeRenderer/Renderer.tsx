import React from 'react';
import { Input, Table } from '@infra/ui';
import styled from 'styled-components';
import { EditorComponentEntity, EditorEntityState } from '@engine/visual-editor/types';
import { EditableTable } from './Table';
import ContainerWrapperCom from '../ContainerWrapperCom';

export interface ComponentTypeRendererProps {
  entity: EditorComponentEntity
  entityState: EditorEntityState
  node
}

const ComponentWrapper = styled.div`
  /* padding: 0.1px; */
`;

const FormLabel = ({ children, className = '', ...props }) => (children ? (
  <div
    className="control-label form-title"
    {...props}
  >{children}</div>
) : null);

/**
 * 根据 component entity 解析的组件渲染器
 */
export const ComponentTypeRenderer: React.FC<ComponentTypeRendererProps> = (props) => {
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
    <ComponentWrapper
      className="comp-renderer"
      style={style}
    >
      {Com}
    </ComponentWrapper>
  );
};
