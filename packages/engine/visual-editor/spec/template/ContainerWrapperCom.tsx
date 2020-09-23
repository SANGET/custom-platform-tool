/**
 * 具体 container 实现的地方
 */

import React from 'react';
import { FacToComponentProps } from '../dragable-item-wrapper-fac';

const containerLayoutParser = (layoutInfo): React.CSSProperties => {
  return {
    display: 'flex',
    flex: 1
  };
};

type ContainerWrapperComProps = FacToComponentProps

const ContainerWrapperCom: React.FC<ContainerWrapperComProps> = (props) => {
  const {
    children,
    entityState,
  } = props;
  const { style, layout: layoutProps } = entityState;

  return (
    <div className="container-wrapper">
      <div
        style={containerLayoutParser(layoutProps)}
      >
        {children}
      </div>
    </div>
  );
};

export default ContainerWrapperCom;
