/**
 * 具体 container 实现的地方
 */

import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

import DragItem from '../DragItem';
import { FacToComponentProps } from '../dragable-item-wrapper-fac';
import DropContainer from '../DropContainer';
import { ItemTypes } from '../types';

const ContainerWrapper = styled.div`
  position: relative;
  padding: 20px;
  background-color: rgba(0,0,0, 0.1);
  /* margin: 10px; */
  /* &:hover {
    background-color: rgba(0,0,0, 0.15);
  } */
  /* &.overing {
    background-color: rgba(48, 95, 144, 0.5);
  } */
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
    currEntity,
    id,
    idx,
    node,
    onClick,
    getEntityProps,
    onMove,
    onDrop
  } = props;
  const entityState = getEntityProps(id) || {};
  const { style } = entityState;
  const { layout: layoutProps } = node;
  // const _style = Object.assign({}, style, containerLayoutParser(layoutProps));

  return (
    // <DropContainer
    //   isSelected={isSelected}
    //   id={id}
    // >
    <DragItem
      id={id}
      index={idx}
      onMove={onMove}
      onDrop={onDrop}
      onClick={onClick}
      dragItemClass={currEntity}
      type={ItemTypes.DragItemEntity}
    >
      <ContainerWrapper>
        <div
          style={containerLayoutParser(layoutProps)}
        >
          {children}
        </div>
      </ContainerWrapper>
    </DragItem>
    // </DropContainer>
  );
};

export default ContainerWrapperCom;
