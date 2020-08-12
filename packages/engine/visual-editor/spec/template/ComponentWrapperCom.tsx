/**
 * 具体 component 实现的地方
 */

import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

import DragItem from './DragItemInCanvas';
import { ComponentTypeRenderer } from './ComponentTypeRenderer';
import { FacToComponentProps } from '../wrapper-fac';

const ComponentWrapper = styled.div`
  position: relative;
  padding: 0.1px;
  /* background-color: rgba(0,0,0, 0.8); */
  /* margin: 10px; */
  /* color: #FFF; */
  /* &:hover {
    background-color: rgba(0,0,0, 0.7);
  } */
  &.selected {
    /* box-shadow: 0 0 1px 3px rgba(127, 113, 185, 0.5); */
    >.state-mark {
      /* pointer-events: none; */
      border-color: blue;
    }
  }
`;

type ComponentWrapperComProps = FacToComponentProps

const ComponentWrapperCom: React.FC<ComponentWrapperComProps> = ({
  currEntity,
  id,
  node,
  onDrop,
  onClick,
  getSelectedState,
  getEntityProps,
}) => {
  const isSelected = getSelectedState(id);
  const classes = classnames([
    isSelected && 'selected'
  ]);

  const entityState = getEntityProps(id) || {};
  const { style } = entityState;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick(e, currEntity);
      }}
      className="relative"
    >
      <DragItem
        dragItemClass={currEntity}
      >
        <ComponentWrapper
          className={classes}
          style={style}
        >
          <ComponentTypeRenderer
            entityState={entityState}
            entity={currEntity}
          />
          <div className="state-mark fill"></div>
        </ComponentWrapper>
      </DragItem>
    </div>
  );
};

export default ComponentWrapperCom;
