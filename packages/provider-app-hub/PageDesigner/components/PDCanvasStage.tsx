import React from 'react';
import CanvasStage from '@engine/visual-editor/components/CanvasStage';
import { PDdragableItemWrapperFac } from './PDDragableItemWrapperFac';

const PDCanvasStage = (props) => {
  return (
    <div style={{ height: '100%' }}>
      <CanvasStage
        dragableItemWrapper={PDdragableItemWrapperFac}
        {...props}
      />
    </div>
  );
};

export default PDCanvasStage;
