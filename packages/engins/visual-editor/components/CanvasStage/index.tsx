/**
 * CanvasStage
 */
import React from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';

import { ItemTypes } from '../ComponentPanel/types';
import { Dispatcher } from '../../core/actions';
import { VisualEditorStore } from '../../core/store';

const StageRender = styled.div`
  min-height: 50vh;
  background-color: #fafafa;
  padding: 10px;
  &.renderer {
    &.overing {
      background-color: #EEE;
    }
  }
`;

export interface CanvasStageProps {
  selectEntity: Dispatcher['SelectEntity']
  layoutContent: VisualEditorStore['layoutContentState']
}

const CanvasStage = ({
  selectEntity,
  layoutContent
}: CanvasStageProps) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.DragComponent,
    drop: ({ entity }) => {
      // console.log('drop');
      console.log(entity);
      selectEntity(entity);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <StageRender
      ref={drop}
      className={`canvas-stage renderer${isOver ? ' overing' : ''}`}
    >
      CanvasStage
    </StageRender>
  );
};

export default CanvasStage;
