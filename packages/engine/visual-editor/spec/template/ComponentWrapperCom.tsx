/**
 * 具体 component 实现的地方
 */

import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

import DragItem from '../DragItem';
import { ComponentTypeRenderer } from './ComponentTypeRenderer';
import { FacToComponentProps } from '../wrapper-fac';

const ComponentWrapper = styled.div`
  padding: 5px;
  background-color: rgba(0,0,0, 0.8);
  margin: 10px;
  color: #FFF;
  &:hover {
    background-color: rgba(0,0,0, 0.7);
  }
  &.selected {
    box-shadow: 0 0 1px 3px rgba(127, 113, 185, 0.5);
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
    >
      <DragItem
        dragItemClass={currEntity}
      >
        <ComponentWrapper
          className={classes}
          style={style}
        >
          <div>组件, ID: {id}</div>
          <ComponentTypeRenderer
            {...currEntity}
          />
        </ComponentWrapper>
      </DragItem>
    </div>
  );
};

export default ComponentWrapperCom;
