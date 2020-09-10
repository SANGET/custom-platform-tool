import React from 'react';
import styled from 'styled-components';

const TempEntityTipWrapper = styled.div`
  height: 50px;
  border: 2px dashed #376BFB;
`;

export const TempEntityTip = ({ children = '' }) => {
  return (
    <TempEntityTipWrapper>
      {children}
    </TempEntityTipWrapper>
  );
};
