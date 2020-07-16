import React from 'react';
import { Input, Button } from '@infra/ui';

export interface ComponentTypeRendererProps {
  component: {
    type: string
  }
}

/**
 * 根据 component entity 解析的组件渲染器
 */
export const ComponentTypeRenderer: React.FC<ComponentTypeRendererProps> = ({
  component,
  ...props
}) => {
  let Com = <div></div>;
  switch (component.type) {
    case 'Input':
      Com = (
        <Input
          {...props}
        />
      );
      break;
    default:
      break;
  }
  return Com;
};
