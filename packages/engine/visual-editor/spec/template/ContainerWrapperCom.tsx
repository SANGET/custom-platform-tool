/**
 * 具体 container 实现的地方
 */

import React from 'react';
import styled from 'styled-components';
import { FacToComponentProps } from '../dragable-item-wrapper-fac';

const ContainerWrapper = styled.div`
  position: relative;
  padding: 20px;
  background-color: rgba(0,0,0, 0.1);
`;

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
    <ContainerWrapper>
      <div
        style={containerLayoutParser(layoutProps)}
      >
        {children}
      </div>
    </ContainerWrapper>
  );
};

export default ContainerWrapperCom;
