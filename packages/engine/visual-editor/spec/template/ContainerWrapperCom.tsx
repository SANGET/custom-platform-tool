/**
 * 具体 container 实现的地方
 */

import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

import DragItem from '../DragItem';
import { FacToComponentProps } from '../dragable-item-wrapper-fac';
import DropContainer from '../DropContainer';

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

const ContainerWrapperCom: React.FC<ContainerWrapperComProps> = ({
  children,
  currEntity,
  id,
  node,
  onClick,
  getSelectedState,
  getEntityProps,
  onDrop
}) => {
  const isSelected = getSelectedState(id);

  const classes = classnames([
    // isOverCurrent && 'overing',
    isSelected && 'selected'
  ]);

  const entityState = getEntityProps(id) || {};
  const { style } = entityState;
  const { layout: layoutProps } = node;
  // const _style = Object.assign({}, style, containerLayoutParser(layoutProps));

  // TODO: 修复 flex 布局的问题
  return (
    <DropContainer
      isSelected={isSelected}
      id={id}
      onDrop={(dragEntity, _id) => {
        onDrop(dragEntity, _id);
      }}
      onClick={(e) => {
        onClick(e, currEntity);
      }}
    >
      <DragItem
        dragItemClass={currEntity}
      >
        <ContainerWrapper
          className={classes}
        >
          <div
            style={containerLayoutParser(layoutProps)}
          >
            {children}
          </div>
        </ContainerWrapper>
      </DragItem>
    </DropContainer>
  );
};

export default ContainerWrapperCom;
