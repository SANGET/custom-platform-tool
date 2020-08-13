/**
 * 具体 component 实现的地方
 */

import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

import DragItem from '../DragItem';
import { ComponentTypeRenderer } from './ComponentTypeRenderer';
import { FacToComponentProps } from '../dragable-item-wrapper-fac';

const ComponentWrapper = styled.div`
  position: relative;
  padding: 0.1px;
  /* background-color: rgba(0,0,0, 0.8); */
  /* margin: 10px; */
  /* color: #FFF; */
  /* &:hover {
    background-color: rgba(0,0,0, 0.7);
  } */
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
        </ComponentWrapper>
      </DragItem>
    </div>
  );
};

export default ComponentWrapperCom;
