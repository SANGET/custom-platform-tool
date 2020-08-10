import React from 'react';
import { Input, Button } from '@infra/ui';
import { EditorComponentEntity, EditorEntityState } from '@engine/visual-editor/types';

export interface ComponentTypeRendererProps {
  entity: EditorComponentEntity
  entityState: EditorEntityState
}

/**
 * 根据 component entity 解析的组件渲染器
 */
export const ComponentTypeRenderer: React.FC<ComponentTypeRendererProps> = ({
  entity,
  entityState
}) => {
  const { component } = entity;
  const { label } = entityState;
  // console.log(entityState);

  let Com = <div></div>;
  if (!component) return Com;

  const { type, ...props } = component;
  switch (type) {
    case 'Input':
      Com = (
        <div className="">
          <span className="control-label">{label}</span>
          <Input
            {...props}
          />
        </div>
      );
      break;
    default:
      break;
  }
  return Com;
};
