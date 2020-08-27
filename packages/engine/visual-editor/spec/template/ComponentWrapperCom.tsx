/**
 * @author zxj
 * component 实现规格
 * 应用放需要根据实际需求，实现组件的过滤
 */

import React from 'react';

import { ComponentRenderer } from './ComponentRenderer';
import { FacToComponentProps } from '../dragable-item-wrapper-fac';

type ComponentWrapperComProps = FacToComponentProps

const ComponentWrapperCom: React.FC<ComponentWrapperComProps> = (props) => {
  const {
    currEntity,
    node,
    onClick,
    entityState,
  } = props;
  // console.log(currEntity._state);
  return (
    <div
      onClick={onClick}
      className="relative"
    >
      <ComponentRenderer
        entityState={entityState}
        entity={currEntity}
        node={node}
      />
    </div>
  );
};

export default ComponentWrapperCom;
