/**
 * @author zxj
 * 具体 component 实现的地方
 */

import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

import DragItem from '../DragItem';
import { ComponentTypeRenderer } from './ComponentTypeRenderer';
import { FacToComponentProps } from '../dragable-item-wrapper-fac';
import { ItemTypes } from '../types';

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
  idx,
  node,
  onDrop,
  onMove,
  onClick,
  getSelectedState,
  getEntityProps,
}) => {
  const entityState = getEntityProps(id) || {};
  const { style } = entityState;

  return (
    <div
      onClick={onClick}
      className="relative"
    >
      <DragItem
        id={id}
        index={idx}
        onDrop={onDrop}
        dragItemClass={currEntity}
        type={ItemTypes.DragItemEntity}
        accept={[ItemTypes.DragItemEntity, ItemTypes.DragItemClass]}
        onMove={onMove}
      >
        <ComponentWrapper
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
