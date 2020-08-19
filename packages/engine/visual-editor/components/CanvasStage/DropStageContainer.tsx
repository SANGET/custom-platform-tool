/**
 * DropStageContainer
 */
import React, { useState, useReducer, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';
import classnames from 'classnames';
import {
  DragItemClass, DropCollectType, EntitiesStateStore,
  EditorPageEntity
} from '@engine/visual-editor/types';

const StageRender = styled.div`
  min-height: 50vh;
  background-color: rgba(0,0,0, 0.05);
  padding: 10px;
  border: 1px solid #EEE;
  &:hover {
    background-color: rgba(0,0,0, 0.05);
  }
  &.renderer {
    &.overing {
      background-color: rgba(0,0,0, 0.08);
    }
  }
`;

/**
 * 中央舞台组件的 props
 */
export interface DropStageProps {
  onDrop
  style
  className?
  accept
  onStageClick
  children
}

/**
 * 中央舞台组件
 */
const DropStageContainer: React.FC<DropStageProps> = ({
  onDrop,
  style,
  className,
  accept,
  onStageClick,
  children,
}) => {
  const [{
    isOverCurrent
  }, drop] = useDrop<DragItemClass, void, DropCollectType>({
    accept,
    drop: (dropOptions) => {
      const { dragItemClass, type } = dropOptions;
      if (isOverCurrent) {
        const _dragItemClass = { ...dragItemClass };
        onDrop(_dragItemClass, dropOptions);
      }
    },
    collect: (monitor) => ({
      // isOver: !!monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  const stageClasses = classnames([
    className,
    'canvas-stage',
    'renderer',
    isOverCurrent && 'overing'
  ]);

  return (
    <StageRender
      ref={drop}
      onClick={(e) => {
        onStageClick && onStageClick();
      }}
      className={stageClasses}
      style={style}
    >
      {children}
    </StageRender>
  );
};

export default DropStageContainer;
